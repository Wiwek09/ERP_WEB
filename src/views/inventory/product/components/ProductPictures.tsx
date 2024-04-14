import { useState, MouseEvent, useEffect } from 'react';
import {
    Grid,
    Box,
    Button,
    TextField
} from '@mui/material';
import { BiPlus } from "react-icons/bi";
import Dropzone from '../../../../components/Dropzone';
import { uploadFileAPI } from '../../../../services/fileUploadApi';
import ProductImageTable from './ProductImageTable';
import { addProductPhotoDetails, getProduct } from '../../../../services/productApi';
import {
    successMessage,
    errorMessage
} from "../../../../utils/messageBox/Messages";
import { useParams } from 'react-router-dom';
import { IParams } from '../../../../interfaces/params';
import { InitialProductData } from "../components/initialState";
import { useAppSelector } from "../../../../app/hooks";


const ProductPictures = () => {
    const { id }: IParams = useParams();
    const [refImage, setRefImage] = useState<File[] | null>(null);
    const [imageDetails, setImageDetails] = useState({});
    const companyData = useAppSelector((state) => state.company.data);
    const [data, setData]=useState({
        ...InitialProductData,
        ExciseDuty: companyData.ExciseDuty,
        TaxRate: companyData.VATRate,
    });

    const getProductData = async () => {
        const response = await getProduct(id);
        if (response) {
          setData(response);
        }
    };

    useEffect(()=> {
        getProductData();
    },[data])


    const onImageAdd = async (e: MouseEvent<HTMLButtonElement>) => {
        try {
            const response = await addProductPhotoDetails({...imageDetails, MenuItemPortionId:data.Id })
            if(response>0){
                successMessage();
            }
            if(refImage) {
                const res = await uploadFileAPI(refImage, 'Product',response);
            }
        } catch (err) {
            errorMessage();
        }
    }
    return(
        <Box sx={{ marginTop: 0 }}>
            <Grid
            container
            py={4}
            borderTop="solid 1px black"
            borderBottom="solid 1px black"
            spacing={2}
            mt={2}
            >
                <ProductImageTable productData={data} setProductData={setData} />
                <Grid
                    item
                    xs={6}
                >
                    <Dropzone 
                        onDrop={(file) => setRefImage(file)}
                    />

                </Grid>

                <Grid
                    item
                    xs={6}
                >
                    <TextField
                    sx={{ marginTop:2 }}
                    helperText="Please enter the name of image"
                    label="Name"
                    variant="outlined"
                    placeholder="Name"
                    name="Name"
                    size="small"
                    fullWidth
                    onChange={(e)=>{
                        setImageDetails({...imageDetails, Name: e.target.value})
                    }}
                    />
                    <TextField
                    sx={{ marginTop:2 }}
                    helperText="Please enter sequence no. of the image"
                    label="Sequence Number"
                    variant="outlined"
                    type="number"
                    placeholder="Sequence Number"
                    name="Sequence"
                    size="small"
                    onChange={(e)=>{
                        setImageDetails({...imageDetails, Sequence: parseInt(e.target.value)})
                    }}
                    />
                </Grid>
        
                <Button
                    onClick={onImageAdd}
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<BiPlus />}
                    sx={{ mx: 1, mt:4 }}
                >
                    Add
                </Button>
                {/* <input type="file" style={{ marginLeft: "15px" }} /> */}
            </Grid>
        </Box>
    );
}

export default ProductPictures;