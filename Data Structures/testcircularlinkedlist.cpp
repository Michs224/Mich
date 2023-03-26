#include <stdio.h>
#include <stdlib.h>

struct node {
	int data;
	struct node *next;
}*head=NULL;

void insertempty(int data){
	struct node*temp=(struct node*)malloc (sizeof(struct node));
	temp->data=data;
	temp->next=temp;
	head=temp;
}

void insertbegin(int data){
	struct node*temp=(struct node*)malloc (sizeof(struct node));
	
	
	if(head==NULL){
		insertempty(data);
	}
	else{
		
		struct node*last=head;
		temp->data=data;
		while(last->next!=head) last=last->next;
		last->next=temp;
		temp->next=head;
		head=temp;
	}
	
}
void insertend(int data){
	struct node*temp=(struct node*)malloc (sizeof(struct node));
	
	if(head==NULL){
		insertempty(data);
	}
	else{
		
		struct node*last=head;
		temp->data=data;
		while(last->next!=head) last=last->next;
		last->next=temp;
		temp->next=head;
	}
//	head=temp;
}


void display(){
	struct node *temp=head;
	if(head==NULL){
		printf("Linked list empty\n");
		return;
	}
	
	do{
		printf("%d ",temp->data);
		temp=temp->next;
	}while(temp!=head);
	printf("\n");
}

void deletebegin(){
	struct node*temp=head;
	if(head==NULL){
		printf("Linked list is empty\n");
		return;
	}
	else if(temp->next==head){
		temp=NULL;
		head=temp;
	}
	else{
		while(temp->next!=head){
			temp=temp->next;
		}
		head=head->next;
		temp->next=head;
	}
		
}

void deleteend(){
	struct node*temp=head;
	struct node*pre;
	if(head==NULL){
		printf("Linked list is empty\n");
		return;
	}
	else if(temp->next==head){
		temp=NULL;
		head=temp;
	}
	else{
		while(temp->next!=head){
			pre=temp;
			temp=temp->next;
		}
		pre->next=head;

	}
	free(temp);
}

int main(){
	insertbegin(10);
	insertbegin(5);
	insertend(25);
//	deletebegin();
	display();
	deleteend();
	display();
	
	return 0;
}
