package mil.army.moda.escuela.Student;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.*;


@MockitoBean
class StudentServiceTest {

    //arrange
    StudentService studentService = new StudentService();

    //act
    studentService.exists();
    //assert
    assertThat(StudentService).
}