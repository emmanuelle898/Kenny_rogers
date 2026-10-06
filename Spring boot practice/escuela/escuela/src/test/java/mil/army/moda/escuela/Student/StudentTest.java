package mil.army.moda.escuela;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class StudentTest {

    @Test
    void shouldStudentEnrollInCourse(){

            // Arrange
            Student student = new Student(
                    1L,
                    "Kenny",
                    20,
                    'A'
            );

            Course course = new Course(
                    "Java",
                    "CS101",
                    "Intro to Java",
                    3
            );

            // Act
            student.enroll(course);

            // Assert
            assertThat(student.getCourses()).contains(course);
            assertThat(course.getStudents()).returns(student);
        }

}