#include <stdio.h>
#include <stdlib.h>

struct Node {
	int data;
	struct Node *next;
} *head = NULL;

void insertEmpty(int data) {
	struct Node *temp = (struct Node *) malloc(sizeof(struct Node));
	
	temp->data = data;
	temp->next = temp;
	
	head = temp;
};

void insertBegin(int data) {
	struct Node *temp = (struct Node *) malloc(sizeof(struct Node));
	
	if(head == NULL) {
		insertEmpty(data);
	} else {
		struct Node *last = head;
		temp->data = data;
		temp->next = head;
		while(last->next != head) {
			last = last->next;
		}
		last->next = temp;
		head = temp;
	}
}

void insertEnd(int data) {
	struct Node *temp = (struct Node *) malloc(sizeof(struct Node));
	
	if(head == NULL) {
		insertEmpty(data);
	} else {
		struct Node *last = head;
		temp->data = data;
		while(last->next != head) {
			last = last->next;
		}
		last->next = temp;
		temp->next = head;
	}
}

void deleteBegin() {
	struct Node *temp = head;
	
	if(head == NULL) {
		printf("Linked list empty");
		return;
	}
	
	if(temp->next == head) {
		head = NULL;
	} else {
		struct Node *last = head;
		while(last->next != head) {
			last = last->next;
		}
		
		head = head->next;
		last->next = head;
	}
	
	free(temp);
}

void deleteEnd() {
	struct Node *temp = head;
	
	if(head == NULL) {
		printf("Linked list empty");
		return;
	}
	
	if(temp->next == head) {
		head = NULL;
	} else {
		struct Node *prev = NULL;
		
		while(temp->next != head) {
			prev = temp;
			temp = temp->next;
		}
		
		prev->next = temp->next;
	}
	
	free(temp);
}

void display() {
	struct Node *temp = head;
	
	if(head == NULL) {
		printf("Linked list empty\n");
		return;
	} 
		
	do {
		printf("%d ", temp->data);
		temp = temp->next;
	} while(temp != head);
	
	printf("\n");
}

int main() {
	insertBegin(10);
	insertBegin(5);
	insertEnd(25);
	display();
//	deleteBegin();
	deleteEnd();
	display();
}

