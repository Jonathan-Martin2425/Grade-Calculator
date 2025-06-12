import { Application, Request , Response} from "express";
import { Course, Grade, Quarter, School, SchoolDataProvider } from "../SchoolDataProvider";
import { verifyAuthToken } from "../TokenVerification";
import { ObjectId } from "mongodb";
import { IApiSchoolData } from "common/ApiImageData";

export function registerSchoolDataRoutes(app: Application, dataProvider: SchoolDataProvider){
    app.use("/api/*", verifyAuthToken);

    app.get("/api/schools", (req: Request, res: Response) => {
            if(req.user){
                let data = dataProvider.getSchoolData(req.user.username);

                if(!data){
                    res.status(500).send();
                    return;
                }

                data.then((schools) => {
                    res.send(schools);
                }).catch(console.error)
            }
        }
    )

    app.post("/api/schools", async (req: Request, res: Response) => {
            const name = req.body.name;
            const user = req.user;
            if(name && user){
                const createRes = dataProvider.createSchool(name, user.username)
                if((await createRes).acknowledged){
                    res.status(201).send()
                }else{
                    res.status(500).send("School wasn't created");
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "School requires a name",
                })
            }
        }
    )

    app.post("/api/quarters", async (req: Request, res: Response) => {
            const name = req.body.name;
            const schoolName = req.body.school;
            const user = req.user;
            if(name && user && schoolName){
                const school: School = (await dataProvider.findOnePiece("school", {user: user.username, name: schoolName})) as School
                if(school){
                    const createRes = await dataProvider.createQuarter(name)
                    if(createRes.acknowledged){
                        school.quarters.push(createRes.insertedId)
                        dataProvider.updateSchool(school)
                        res.status(201).send()
                    }else{
                        res.status(500).send("Quarter wasn't created");
                    }
                }else{
                    res.status(400).send("School wasn't found");
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Quarter requires a name and school",
                })
            }
        }
    )

    app.post("/api/classes", async (req: Request, res: Response) => {
            const name = req.body.name;
            const schoolName = req.body.school;
            const quarterName = req.body.quarter;
            const user = req.user;
            if(name && user && schoolName && quarterName){
                const quarters: Quarter[] = (await dataProvider.findOnePiece("quarter", {user: user.username, name: quarterName, school: schoolName})) as Quarter[]
                if(quarters.length > 0){
                    const quarter = quarters[0];
                    const createRes = await dataProvider.createCourse(name)
                    if(createRes.acknowledged){
                        quarter.classes.push(createRes.insertedId);
                        dataProvider.updateQuarter(quarter);
                        res.status(201).send()
                    }else{
                        res.status(500).send("Course wasn't created");
                    }
                }else{
                    res.status(400).send("School or Quarter wasn't found");
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Course requires a name, school and quarter",
                })
            }
        }
    )

    app.post("/api/grades", async (req: Request, res: Response) => {
            const schoolName = req.body.school;
            const quarterName = req.body.quarter;
            const courseName = req.body.class;
            const gradeRow: Grade = {
                catagory: req.body.catagory,
                percentage: req.body.percentage,
                grade: req.body.grade,
            }

            const user = req.user;
            if(user && schoolName && quarterName && courseName){
                const courses: Course[] = (await dataProvider.findOnePiece("course", {
                    user: user.username, 
                    name: courseName,
                    school: schoolName,
                    quarter: quarterName,
                })) as Course[];
                if(courses.length > 0){
                    const course = courses[0]
                    course.gradeRows.push(gradeRow);
                    dataProvider.updateCourse(course);
                    res.status(201).send()
                }else{
                    res.status(400).send("Course wasn't found");
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Grade requires a catagory, percentage, grade, school, quarter and course",
                })
            }
        }
    )

    app.patch("/api/schools", async (req: Request, res: Response) => {
            const curName = req.body.name;
            const newName = req.body.newName;
            const user = req.user;
            if(curName && newName && user){
                const school: School = (await dataProvider.findOnePiece("school", {user: user.username, name: curName})) as School;
                if(school){
                    school.name = newName;
                    dataProvider.updateSchool(school);
                    res.status(204).send();
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "School wasn't found with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "School requires a name",
                })
            }
        }
    )

    app.patch("/api/quarters", async (req: Request, res: Response) => {
            const curName = req.body.name;
            const newName = req.body.newName;
            const schoolName = req.body.school;
            const user = req.user;
            if(curName && newName && user && schoolName){
                const quarters: Quarter[] = (await dataProvider.findOnePiece("quarter", {user: user.username, name: curName, school: schoolName})) as Quarter[];
                if(quarters.length > 0){
                    const quarter = quarters[0];
                    quarter.name = newName;
                    dataProvider.updateQuarter(quarter);
                    res.status(204).send();
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Quarter wasn't found with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Quarter requires a name and school",
                })
            }
        }
    )

    app.patch("/api/classes", async (req: Request, res: Response) => {
            const curName = req.body.name;
            const newName = req.body.newName;
            const schoolName = req.body.school;
            const quarterName = req.body.quarter;
            const user = req.user;
            if(curName && newName && user && schoolName && quarterName){
                const courses: Course[] = (await dataProvider.findOnePiece("course", {user: user.username, name: curName, school: schoolName, quarter: quarterName})) as Course[];
                if(courses.length > 0){
                    const course = courses[0];
                    course.name = newName;
                    dataProvider.updateCourse(course);
                    res.status(204).send();
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Course wasn't found with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Course requires a name, quarter and school",
                })
            }
        }
    )

    app.patch("/api/grades", async (req: Request, res: Response) => {
            const schoolName = req.body.school;
            const quarterName = req.body.quarter;
            const courseName = req.body.class;
            const curGradeRow: Grade = req.body.gradeRow;
            const newGradeRow: Grade = req.body.newGradeRow
            const user = req.user;
            if(user && schoolName && quarterName && courseName && curGradeRow && newGradeRow){
                const courses: Course[] = (await dataProvider.findOnePiece("course", {user: user.username, name: courseName, school: schoolName, quarter: quarterName})) as Course[];
                if(courses.length > 0){
                    const course = courses[0];

                    // gets grade index by match each value in gradRow with the curGradeRow
                    const gradeIndex = course.gradeRows.findIndex((grade) => (
                        curGradeRow.catagory === grade.catagory &&
                        curGradeRow.percentage === grade.percentage &&
                        curGradeRow.grade === grade.grade
                    ))

                    if(gradeIndex === -1){
                        res.status(500).send("Didn't update Grade");
                        return;
                    }

                    // sets all the properties of the curGradeRow to the properies of the newGraderow
                    // with the found gradeIndex
                    course.gradeRows[gradeIndex].catagory = newGradeRow.catagory;
                    course.gradeRows[gradeIndex].percentage = newGradeRow.percentage;
                    course.gradeRows[gradeIndex].grade = newGradeRow.grade;

                    dataProvider.updateCourse(course);
                    res.status(204).send();
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Course wasn't found with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Grade requires a catagory, percentage, grade, school, quarter and course",
                })
            }
        }
    )

    app.delete("/api/schools", async (req: Request, res: Response) => {
            const name = req.body.name;
            const user = req.user;
            if(name && user){
                const deleteRes = await dataProvider.deleteSchool({name: name, user: user.username})
                if(deleteRes.deletedCount > 0){
                    res.status(204).send();
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "School wasn't deleted with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "School requires a name",
                })
            }
        }
    )

    app.delete("/api/quarters", async (req: Request, res: Response) => {
            const name = req.body.name;
            const schoolName = req.body.school;
            const user = req.user;
            if(name && schoolName && user){
                const quarters = (await dataProvider.findOnePiece("quarter", {name: name, user: user.username, school: schoolName})) as Quarter[];
                if(quarters.length > 0){
                    const deleteRes = await dataProvider.deleteQuarter(quarters[0]);
                    if(deleteRes.deletedCount > 0){
                        res.status(204).send();
                    }else{
                        res.status(500).send("Didn't delete Quarter");
                    }
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Course wasn't found and deleted with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Quarter requires a name and school",
                })
            }
        }
    )

    app.delete("/api/classes", async (req: Request, res: Response) => {
            const name = req.body.name;
            const schoolName = req.body.school;
            const quarterName = req.body.quarter;
            const user = req.user;
            if(name && schoolName && quarterName && user){
                const courses = (await dataProvider.findOnePiece("course", {name: name, user: user.username, school: schoolName, quarter: quarterName})) as Course[];
                if(courses.length > 0){
                    const deleteRes = await dataProvider.deleteCourse(courses[0]);
                    if(deleteRes.deletedCount > 0){
                        res.status(204).send();
                    }else{
                        res.status(500).send("Didn't delete Course");
                    }
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Course wasn't found and deleted with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Course requires a name, quarter and school",
                })
            }
        }
    )

    app.delete("/api/grades", async (req: Request, res: Response) => {
            const name = req.body.class;
            const schoolName = req.body.school;
            const quarterName = req.body.quarter;
            const gradeRow = req.body.gradeRow;
            const user = req.user;
            if(name && schoolName && quarterName && gradeRow && user){
                const courses = (await dataProvider.findOnePiece("course", {name: name, user: user.username, school: schoolName, quarter: quarterName})) as Course[];
                if(courses.length > 0){
                    const course = courses[0];

                    // gets grade index by match each value in gradRow with the curGradeRow
                    const gradeIndex = course.gradeRows.findIndex((grade) => (
                        gradeRow.catagory === grade.catagory &&
                        gradeRow.percentage === grade.percentage &&
                        gradeRow.grade === grade.grade
                    ))

                    if(gradeIndex === -1){
                        res.status(500).send("Didn't delete Grade");
                        return;
                    }

                    course.gradeRows.splice(gradeIndex, 1);
                    dataProvider.updateCourse(course);
                    res.status(204).send();
                }else{
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Course wasn't found and deleted with the given parameters",
                    });
                }
            }else{
                res.status(400).send({
                    error: "Bad Request",
                    message: "Course requires a name, quarter and school",
                })
            }
        }
    )

}