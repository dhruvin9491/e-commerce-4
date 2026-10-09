export const GenerateMetaData = () => {
    return {
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}