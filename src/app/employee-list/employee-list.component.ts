import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  dataSource = new MatTableDataSource<Employee>(); // Initialize as empty MatTableDataSource
  displayedColumns: string[] = ['employeeName', 'employeeContactNumber', 'employeeAddress', 'employeeDepartment', 'employeeGender', 'employeeSkills', 'edit', 'delete'];

  constructor(private employeeService: EmployeeService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getEmployeeList(); // Fetch employee list when component is initialized
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateEmployee(employeeId: number): void {
    this.router.navigate(['/employee', { employeeId: employeeId }]);
  }

  deleteEmployee(employeeId: number) {
    console.log("Attempting to delete employee with ID:", employeeId); // เพิ่ม log เพื่อดูว่าเข้าโค้ดนี้หรือไม่
    Swal.fire({
      title: 'คุณต้องการลบข้อมูลใช่หรือไม่',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'my-swal-popup',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(employeeId).subscribe(response => {
          console.log("Employee deleted successfully:", response); // เพิ่ม log เพื่อดูผลลัพธ์จากการลบ
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
            customClass: {
              popup: 'my-swal-popup',
            }
          });
          this.getEmployeeList();
        }, error => {
          console.error("Error deleting employee:", error); // เพิ่ม log สำหรับตรวจสอบข้อผิดพลาด
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem deleting the employee.',
            icon: 'error',
            customClass: {
              popup: 'my-swal-popup',
            }
          });
        });
      }
    });
  }

  getEmployeeList(): void {
    this.employeeService.getEmployees().subscribe(
      {
        next: (res: Employee[]) => {
          this.dataSource.data = res; // Assign data to MatTableDataSource
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      }
    );
  }
}
