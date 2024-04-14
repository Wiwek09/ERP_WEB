import { useState } from 'react';
import { 
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Input
} from "@mui/material";

import {
    editMessage,
    errorMessage,
    deleteRowMessage
  } from "../../../../utils/messageBox/Messages";

import { BiEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { deleteProductPhotoDetails, editProductPhotoDetails } from "../../../../services/productApi";
import { BsCheckCircle } from 'react-icons/bs';
import { FcCancel } from 'react-icons/fc';

const deleteItemPicture = async (id:number) => {
    
    const response = await deleteProductPhotoDetails(id);
    if(response>0){
        deleteRowMessage();
    } else {
        errorMessage();
    }
}

const ProductImageTable = ({productData, setProductData}:any) => {
    
    const { MenuItemPhotos } = productData;
    const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false)
    const [rowId, setRowId] = useState<string | null>('');
    const [rowData, setRowData] = useState({});

    const onRowUpdate = async (id:number) => {

        const response = await editProductPhotoDetails(id,rowData);
        if(response>0){
            editMessage();
            setIsEditEnabled(false);
        } else {
            errorMessage();
        }
    }
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Sequence</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Delete</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {MenuItemPhotos&&MenuItemPhotos.map((item:any)=>{
                        return (
                            <TableRow>
                                <TableCell>
                                    {item.PhoteIdentity
                                    ?(
                                        <img
                                        alt={item.IdentityFileName}
                                        src={'data:image/png;base64,' + item.PhoteIdentity}
                                        height="50"
                                        width="50"
                                    />
                                    ):''}
                                    
                                </TableCell>
                                
                                        {isEditEnabled && rowId === (item.Id).toString()
                                        ?(
                                            <>
                                                <TableCell>
                                                    <Input 
                                                        defaultValue={item.Name}
                                                        name="Name"
                                                        onChange={e=>{
                                                            setRowData({...rowData,Name:e.target.value})
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        defaultValue={item.Sequence}
                                                        type="number"
                                                        name="Sequence"
                                                        onChange={e=>{
                                                            setRowData({...rowData,Sequence:e.target.value});
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="success">
                                                        <BsCheckCircle 
                                                            onClick={e=>onRowUpdate(item.Id)}
                                                        />
                                                    </IconButton>
                                                    <IconButton>
                                                        <FcCancel id={item.Id} fontSize={30} onClick={e=>{
                                                            setRowData({});
                                                            setIsEditEnabled(false)
                                                            }} /> 
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )
                                        :(
                                            <>
                                                <TableCell>{item.Name}</TableCell>
                                                <TableCell>{item.Sequence}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="info">
                                                        <BiEditAlt id={item.Id} onClick={e=>{
                                                            setRowData({Name:item.Name,Sequence:item.Sequence});
                                                            setRowId(e.currentTarget.getAttribute('id'));
                                                            setIsEditEnabled(true)
                                                            }} />
                                                    </IconButton>
                                                </TableCell>     
                                            </>
                                        )}
                                
                                <TableCell align="center">
                                    <IconButton color="warning"
                                        onClick = {e => deleteItemPicture(item.Id)}
                                    >
                                        <AiFillDelete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    

                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ProductImageTable;