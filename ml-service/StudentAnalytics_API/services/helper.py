def calculate_average(student):

    return round(

        (

            student["internalMarks"] +

            student["assignmentMarks"] +

            student["practicalMarks"] +

            student["quizMarks"]

        ) / 4,

        2
    )