export const GenerateMetaData = () => {
    return {
        id: crypto.randomUUID(),
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}