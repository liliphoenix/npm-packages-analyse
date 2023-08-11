interface DetailData {
    bgColor: string
    borderColor: string
    packageName: string
    packageVersion: string
}

interface NpmAnalyseRes {
    circular: boolean
    dependencies: Array<NpmAnalyseRes>
    name: string
    version: string
}

