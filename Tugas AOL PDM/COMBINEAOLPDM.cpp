#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

//#define MAX_BOOKS 1000
//#define MAX_LOANS 1000
//#define MAX_USERS 1000
//#define LOAN_DURATION 14 // Number of days a book can be borrowed for

struct Book{
  int id;
  char title[100];
  char author[100];
  char subject[100];
  int stock;
};

struct Loan{
  int id;
  int book_id;
  int student_id;
  time_t due_date;
  float late_fee;
};

struct Student{
  int id;
  char name[100];
  char email[100];
  char address[100];
};

int num_books = 0;
struct Book books[1000];
int num_loans = 0;
struct Loan loans[1000];
int num_students = 0;
struct Student students[1000];

void loadData() {
  // Load books from "books.txt"
  FILE* book_file = fopen("Books.txt", "r");
  if (book_file == NULL) {
    printf("Error opening Books file\n");
    return;
  }
  while (!feof(book_file))
  {
    fscanf(book_file, "%d,%[^,],%[^,],%[^,],%d\n", &books[num_books].id, books[num_books].title, books[num_books].author, books[num_books].subject, &books[num_books].stock);
    num_books++;
  }
  fclose(book_file);
  // Load loans from "loans.txt"
  FILE* loan_file = fopen("Loans.txt", "r");
  if (loan_file == NULL) {
    printf("Error opening Loans file\n");
    return;
  }
  while (!feof(loan_file)) {
    fscanf(loan_file, "%d,%d,%d,%ld,%f\n", &loans[num_loans].id, &loans[num_loans].book_id, &loans[num_loans].student_id, &loans[num_loans].due_date, &loans[num_loans].late_fee);
    num_loans++;
  }
  fclose(loan_file);
  // Load users from "users.txt"
  FILE* student_file = fopen("Students.txt", "r");
  if (student_file == NULL) {
    printf("Error opening Students file\n");
    return;
  }
  while (!feof(student_file)) {
    fscanf(student_file, "%d,%[^,],%[^,],%[^\n]\n", &students[num_students].id, students[num_students].name, students[num_students].email, students[num_students].address);
    num_students++;
  }
  fclose(student_file);
}

void saveData() {
	int i;
  // Save books to "books.txt"
  FILE* book_file = fopen("Books.txt", "w");
//  if (book_file == NULL) {
//    printf("Error opening books file\n");
//    return;
//  }
  for (i = 0; i < num_books; i++) {
    fprintf(book_file, "%d,%s,%s,%s,%d\n", books[i].id, books[i].title, books[i].author, books[i].subject, books[i].stock);
  }
  fclose(book_file);
  // Save loans to "loans.txt"
  FILE* loan_file = fopen("Loans.txt", "w");
//  if (loan_file == NULL) {
//    printf("Error opening loans file\n");
//    return;
//  }
  for (i = 0; i < num_loans; i++) {
    fprintf(loan_file, "%d,%d,%d,%ld,%.2f\n", loans[i].id, loans[i].book_id, loans[i].student_id, loans[i].due_date, loans[i].late_fee);
  }
  fclose(loan_file);
  // Save users to "users.txt"
  FILE* student_file = fopen("Students.txt", "w");
//  if (student_file == NULL) {
//    printf("Error opening users file\n");
//    return;
//  }
  for (i = 0; i < num_students; i++) {
    fprintf(student_file, "%d,%s,%s,%s\n", students[i].id, students[i].name, students[i].email, students[i].address);
  }
  fclose(student_file);
}

// Borrow book function
void borrowBook() {
  int book_id, student_id,i;
  printf("Enter book ID: ");
  scanf("%d", &book_id);
  printf("Enter user ID: ");
  scanf("%d", &student_id);
  // Check if book is in stock
  int book_index = -1;
  for (i = 0; i < num_books; i++) {
    if (books[i].id == book_id) {
      book_index = i;
      break;
    }
  }
  if (book_index == -1) {
    printf("Book not found\n");
    return;
  }
  if (books[book_index].stock == 0) {
    printf("Book is not in stock\n");
    return;
  }
  // Check if user exists
  int student_index = -1;
  for (i = 0; i < num_students; i++) {
    if (students[i].id == student_id) {
      student_index = i;
      break;
    }
  }
  if (student_index == -1) {
    printf("User not found\n");
    return;
  }
  // Update book stock
  books[book_index].stock--;
  // Create new loan
  struct Loan loan;
  loan.id = num_loans + 1;
  loan.book_id = book_id;
  loan.student_id = student_id;
  time_t current_time = time(NULL);
  loan.due_date = current_time + 14 * 24 * 60 * 60; // Due date is 14 days from current date
  loan.late_fee = 0;
  loans[num_loans] = loan;
  num_loans++;
  printf("Book borrowed successfully\n");
}

// Return book function
void returnBook() {
  int book_id, student_id,i;
  printf("Enter book ID: ");
  scanf("%d", &book_id);
  printf("Enter user ID: ");
  scanf("%d", &student_id);
  // Find loan
  int loan_index = -1;
  for (i = 0; i < num_loans; i++) {
    if (loans[i].book_id == book_id && loans[i].student_id == student_id) {
      loan_index = i;
      break;
    }
  }
  if (loan_index == -1) {
    printf("Loan not found\n");
    return;
  }
  // Find book
  int book_index = -1;
  for (i = 0; i < num_books; i++) {
    if (books[i].id == book_id) {
      book_index = i;
      break;
    }
  }
  if (book_index == -1) {
    printf("Book not found\n");
    return;
  }
  // Update book stock
  books[book_index].stock++;
  // Check if the book was returned late
  time_t current_time = time(NULL);
  if (current_time > loans[loan_index].due_date) {
	loans[loan_index].late_fee = (current_time - loans[loan_index].due_date) / (24 * 60 * 60) * 100; // Late fee is $1 per day
	printf("Book was returned late. The late fee is $%.2f\n", loans[loan_index].late_fee / 100);
  } else {
    printf("Book returned successfully\n");
  }
  // Remove loan
  for (i = loan_index; i < num_loans - 1; i++) {
    loans[i] = loans[i + 1];
  }
  num_loans--;
}

//// Search for book function
//void search_book() {
//  char keyword[100];
//  printf("Enter keyword: ");
//  scanf("%s", keyword);
//  // Search through books
//  printf("Results:\n");
//  int search=0;
//  for (int i = 0; i < num_books; i++) {
//    if (strstr(books[i].title, keyword) != NULL || strstr(books[i].author, keyword) != NULL || strstr(books[i].subject, keyword) != NULL) {
//      printf("%d %s %s %s %d\n", books[i].id, books[i].title, books[i].author, books[i].subject, books[i].stock);
//      search=1;
//	}
//  }
//  if (search!=1) printf("Book not found\n");
//}
//
//// Manage book stock function
//void manage_book_stock() {
//  int book_id, new_stock;
//  printf("Enter book ID: ");
//  scanf("%d", &book_id);
//  printf("Enter new stock: ");
//  scanf("%d", &new_stock);
//  // Find book
//  int book_index = -1;
//  for (int i = 0; i < num_books; i++) {
//    if (books[i].id == book_id) {
//      book_index = i;
//      break;
//    }
//  }
//  if (book_index == -1) {
//    printf("Book not found\n");
//    return;
//  }
//  books[book_index].stock = new_stock;
//  printf("Book stock updated successfully\n");
//}

// Calculate late fees function
//void calculate_late_fees() {
//  time_t current_time = time(NULL);
//  for (int i = 0; i < num_loans; i++) {
//    if (current_time > loans[i].due_date) {
//      loans[i].late_fee = (current_time - loans[i].due_date) * 100; // Late fee is $1 per day
//    }
//  }
//}

int main() {
  loadData();
  int choice;
  while(choice!=5){
    printf("\nBINUS @SEMARANG LIBRARY\n");
    printf("1. Borrow book\n");
    printf("2. Return book\n");
    printf("3. Search for book\n");
    printf("4. Manage book stock\n");
    printf("5. Exit\n");
    printf("Enter choice: ");
    scanf("%d", &choice);
    switch(choice) {
      case 1:
        borrowBook();
        break;
      case 2:
        returnBook();
        break;
//      case 3:
//        search_book();
//        break;
//      case 4:
//        manage_book_stock();
//        break;
      case 5:
        saveData();
        printf("Exit...\n");
//        goto labelend;
//        return 0;
        break;
      default:
        printf("Invalid choice, please input the valid selection\n");
        break;
    }
  }
//  labelend:
   return 0;
}
