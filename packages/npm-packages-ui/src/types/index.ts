interface DetailData {
    bgColor: string
    borderColor: string
    packageName: string
    packageVersion: string
}

interface NpmAnalyzeRes {
    circular: boolean
    dependencies: Array<NpmAnalyzeRes>
    name: string
    version: string
}
