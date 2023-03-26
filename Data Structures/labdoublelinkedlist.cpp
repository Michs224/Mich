#include <stdio.h>
#include <stdlib.h>

struct Node {
	int data;
	struct Node *prev;
	struct Node *next;
} *head = NULL;

void insertBegin(int data) {
	struct Node *temp = (struct Node *) malloc(sizeof(struct Node));
	
	struct Node *last = head;
	temp->data = data;
	temp->prev = NULL;
	temp->next = head;
	head = temp;
}

void insertEnd(int data) {
	struct Node *temp = (struct Node *) malloc(sizeof(struct Node));
	
	temp->data = data;
	temp->next = NULL;
	
	struct Node *last = head;
	while(last->next != NULL) {
		last = last->next;
	}
	last->next = temp;
	temp->prev = last;
}

void deleteBegin() {
	struct Node *temp = head;
	
	if(head == NULL) {
		printf("Linked list empty\n");
		return;
	}
	
	if(temp->next == head) {
		head = NULL;
	} else {
		head = head->next;
	}
	
	free(temp);
}

void deleteEnd() {
	struct Node *temp = head;
	
	if(head == NULL) {
		printf("Linked list empty\n");
		return;
	}
	
	if(temp->next == head) {
		head = NULL;
	} else {
		struct Node *prev = NULL;
		
		while(temp->next != NULL) {
			prev = temp;
			temp = temp->next;
		}
		
		prev->next = NULL;
	}
	
	free(temp);
}

void display() {
	if(head == NULL) {
		printf("Linked list empty\n");
		return;
	}
	
	struct Node *temp = head;
	while(temp != NULL) {
		printf("%d ", temp->data);
		temp = temp->next;
	}
	
	printf("\n");
}

int main() {
	insertBegin(20);
	insertBegin(10);
	insertEnd(30);
	display();
	deleteBegin();
	display();
	deleteEnd();
	display();
	
	return 0;
}

