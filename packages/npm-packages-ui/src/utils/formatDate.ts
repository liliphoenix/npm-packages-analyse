export const dealDetailDate = (bgColor:string, borderColor:string, packageName:string, packageVersion:string) => {
    let packageData:DetailData = {
        bgColor,
        borderColor,
        packageName,
        packageVersion
    }
    return packageData
}