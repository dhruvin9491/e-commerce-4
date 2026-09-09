import axios from "axios";

const getErrorMessage = (error) => error.response?.data?.message || error.message || "Something went wrong";

export const getData = async (API) => {
    try {
        const res = await axios.get(API);
        return res;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export const createData = async (API, newData) => {
    try {
        const res = await axios.post(API, newData);
        return res;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export const updateData = async (API, newData) => {
    try {
        const res = await axios.patch(API, newData);
        return res;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}

export const deleteData = async (API, data) => {
    try {
        const res = await axios.patch(API, { isDeleted: !data.isDeleted, updatedAt: new Date().toISOString() });
        return res;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}
