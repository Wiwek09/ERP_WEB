import server from "../server/server";

export const uploadFileAPI = async (
    files: File[],
    moduleName: string,
    id: number
) => {
    const formData = new FormData();
    formData.append('newFileItem', files[0], files[0].name);
    return await server.post(
        `/api/FileUploadAPI/?moduleName=${moduleName}&id=${id}`,
        formData
    );
};