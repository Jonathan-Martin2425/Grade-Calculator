export interface IApiSchoolData  {
    _id?: string,
    user?: string,
    name: string,
    quarters: Quarter[]
}

export interface Quarter {
    name: string,
    classes: Course[],
}
export interface Course{
    name: string,
    gradeRows: Grade[],
}

export interface Grade {
    catagory: string,
    percentage: number,
    grade: string,
}