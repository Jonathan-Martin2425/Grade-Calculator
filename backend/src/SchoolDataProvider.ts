import { MongoClient, ObjectId } from "mongodb";

export interface School  {
    _id: ObjectId,
    user: string,
    name: string,
    quarters: ObjectId[],
}

export interface Quarter {
    _id: ObjectId,
    name: string,
    classes: ObjectId[],
}
export interface Course{
    _id: ObjectId,
    name: string,
    gradeRows: Grade[],
}

export interface Grade {
    catagory: string,
    percentage: number,
    grade: string,
}

export interface findOneQuery{
    name: string,
    user: string,
    school?: string,
    quarter?: string,
    gradeRow?: Grade,
}

function getCollection(collection_name: string | undefined, mongoClient: MongoClient){
    if (!collection_name) {
        throw new Error("Missing a collection_name from environment variables");
    }
    return mongoClient.db().collection(collection_name)
}

/*
    DISCLAMER

    Every use of mongoDB's aggregate function and the pipeline used was
    created with the help of ChatGPT to achive its purpose
*/
export class SchoolDataProvider {
    private schoolCollection;
    private quarterCollection;
    private courseCollection;

    constructor(private readonly mongoClient: MongoClient) {
        const schoolCollection = process.env.SCHOOLS_COLLECTION_NAME;
        const quarterCollection = process.env.QUARTERS_COLLECTION_NAME;
        const courseCollection = process.env.CLASSES_COLLECTION_NAME;

        this.schoolCollection = getCollection(schoolCollection, mongoClient);
        this.quarterCollection = getCollection(quarterCollection, mongoClient);
        this.courseCollection = getCollection(courseCollection, mongoClient);
    }

    getSchoolData(user: string) {
        const quarterCollection = process.env.QUARTERS_COLLECTION_NAME;
        if (!quarterCollection) {
            throw new Error("Missing QUARTERS_COLLECTION_NAME from environment variables");
        }
        const courseCollection = process.env.CLASSES_COLLECTION_NAME;
        if (!courseCollection) {
            throw new Error("Missing QUARTERS_COLLECTION_NAME from environment variables");
        }

        const pipeline: any[] = [];

        pipeline.push(
            {
                $match: {
                user: user,
                }
            },
            // Lookup quarters
            {
                $lookup: {
                from: quarterCollection,
                localField: "quarters",
                foreignField: "_id",
                as: "quarters"
                }
            },
            // Unwinds quarters to join with courses
            {
                $unwind: {
                path: "$quarters",
                preserveNullAndEmptyArrays: true
                }
            },
            // Lookup courses for each quarter
            {
                $lookup: {
                from: courseCollection,
                localField: "quarters.classes",
                foreignField: "_id",
                as: "quarters.classes"
                }
            },
            // Group quarters back into array
            {
                $group: {
                _id: "$_id",
                name: { $first: "$name" },
                user: { $first: "$user" },
                quarters: {
                    $push: {
                    name: "$quarters.name",
                    classes: {
                        $map: {
                        input: "$quarters.classes",
                        as: "cls",
                        in: {
                            name: "$$cls.name",
                            gradeRows: "$$cls.gradeRows"
                        }
                        }
                    }
                    }
                }
                }
            },
            // Convert _id to string for API response
            {
                $project: {
                _id: { $toString: "$_id" },
                name: 1,
                user: 1,
                quarters: 1
                }
            }
        );

        return this.schoolCollection.aggregate(pipeline).toArray();
    }

    findOnePiece(type: string, data: findOneQuery){
        switch (type){
            case "school":
                return this.schoolCollection.findOne({name: data.name, user: data.user})
            case "quarter":
                return this.quarterCollection.aggregate([
                        // Step 1: Match by quarter name
                        {
                            $match: {
                            name: data.name // replace with your input name
                            }
                        },
                        // Step 2: Lookup the schools that reference this quarter
                        {
                            $lookup: {
                            from: "schools",
                            localField: "_id",
                            foreignField: "quarters",
                            as: "schools"
                            }
                        },
                        // Step 3: Unwind the matched schools to access their fields
                        {
                            $unwind: "$schools"
                        },
                        // Step 4: Filter by user and school name
                        {
                            $match: {
                            "schools.user": data.user,  // replace with input user
                            "schools.name": data.school           // replace with input school name
                            }
                        },
                        // Step 5: Optionally project or reshape as needed
                        {
                            $project: {
                            _id: 1,
                            name: 1,
                            classes: 1
                            }
                        }
                        ]).toArray();
                    case "course":
                        return this.courseCollection.aggregate([
                        // Step 1: Match course by name
                        {
                            $match: {
                            name: data.name // replace with the target course name
                            }
                        },
                        // Step 2: Lookup quarters that include this course
                        {
                            $lookup: {
                            from: "quarters",
                            localField: "_id",
                            foreignField: "classes",
                            as: "quarters"
                            }
                        },
                        {
                            $unwind: "$quarters"
                        },
                        // Step 3: Lookup schools that include the matched quarters
                        {
                            $lookup: {
                            from: "schools",
                            localField: "quarters._id",
                            foreignField: "quarters",
                            as: "schools"
                            }
                        },
                        {
                            $unwind: "$schools"
                        },
                        // Step 4: Filter based on user, school name, and quarter name
                        {
                            $match: {
                            "quarters.name": data.quarter,     // replace with quarter name
                            "schools.name": data.school,       // replace with school name
                            "schools.user": data.user// replace with user id/email
                            }
                        },
                        // Step 5: Optionally shape the output
                        {
                            $project: {
                            _id: 1,
                            name: 1,
                            gradeRows: 1
                            }
                        }
                        ]).toArray();
        }

    }

    async createSchool(name: string, user: string){
        return this.schoolCollection.insertOne({name: name, user: user, quarters: []});
    }

    async createQuarter(name: string){
        return this.quarterCollection.insertOne({name: name, classes: []});
    }
    
    async createCourse(name: string){
        return this.courseCollection.insertOne({name: name, gradeRows: []});
    }

    async updateSchool(data: School){
        const res = await this.schoolCollection.updateOne({_id: data._id}, {
            $set: {
                name: data.name,
                user: data.user,
                quarters: data.quarters,
            }
        })

        return res;
    }

    async updateQuarter(data: Quarter){
        const res = await this.quarterCollection.updateOne({_id: data._id}, {
            $set: {
                name: data.name,
                classes: data.classes,
            }
        })

        return res;
    }

    async updateCourse(data: Course){
        const res = await this.courseCollection.updateOne({_id: data._id}, {
            $set: {
                name: data.name,
                gradeRows: data.gradeRows
            }
        })

        return res;
    }

    deleteSchool(data: findOneQuery){
        return this.schoolCollection.deleteOne({name: data.name, user: data.user})
    }

    deleteQuarter(data: Quarter){
        return this.quarterCollection.deleteOne({_id: data._id, name: data.name, classes: data.classes})
    }

    deleteCourse(data: Course){
        return this.courseCollection.deleteOne({_id: data._id, name: data.name, gradeRows: data.gradeRows})
    }
    
}