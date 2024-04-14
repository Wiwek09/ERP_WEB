import { makeStyles } from '@mui/styles';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload } from 'react-icons/fa';
import { Box } from '@mui/material';

interface InputRefProps extends HTMLInputElement {
    acceptedFiles: File[];
}

interface IFileExtend extends File {
    preview: any;
}

const useStyles = makeStyles({
    dropzoneContainer: {
        border: '1px dashed',
        padding: '20px 30px',
    },
    thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    thumb: {
        display: 'inline-flex',
        borderRadius: 2,
        width: 150,
        height: 150,
        boxSizing: 'border-box',
    },
    thumbInner: {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden',
    },
    img: {
        display: 'block',
        width: 'auto',
        height: '100%',
    },
});

interface IDropzoneProps {
    onDrop: (files: File[]) => void;
    previewFiles?: File[];
}

const Dropzone = ({ onDrop, previewFiles }: IDropzoneProps) => {
    const styles = useStyles();
    const inputRef = useRef<InputRefProps>(null);
    const [acceptedFiles, setAcceptedFiles] = useState<IFileExtend[]>(
        previewFiles?.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        ) ?? []
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: (onDropAcceptedFiles) => {
            if (inputRef.current) {
                inputRef.current.acceptedFiles = onDropAcceptedFiles;
                onDrop(inputRef.current.acceptedFiles);
                setAcceptedFiles(
                    onDropAcceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    )
                );
            }
        },
    });

    const Preview = acceptedFiles.map((file) => (
        <div className={styles.thumb} key={file.name}>
            <div className={styles.thumb}>
                <img
                    className={styles.img}
                    alt={file.name}
                    src={file.preview}
                />
            </div>
        </div>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            acceptedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [acceptedFiles]
    );

    return (
        <div
            className={styles.dropzoneContainer}
            {...getRootProps()}
            onClick={() => inputRef.current?.click()}
        >
            <input {...getInputProps()} accept="image/*" ref={inputRef} />
            
            {isDragActive ? (
                <p>Drop the product image here ...</p>
            ) : (
                <p>Drag drop the product image here, or click to select product image</p>
            )}
            <Box 
                display='flex'
                justifyContent='center'
                mt={2}
            >
                {(acceptedFiles.length !== 0)
                    ?(<ul className={styles.thumbsContainer}>
                        {Preview}
                    </ul>)
                    :(<FaFileUpload fontSize={100} color='#C0C0C0' />)
                }
                
            </Box>
        </div>
    );
};

export default Dropzone;
