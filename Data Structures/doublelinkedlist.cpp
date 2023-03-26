#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct node{
	struct node*previous;
	int angka;
	struct node*next;
};
struct node*start=NULL;

struct node *display(struct node *start){
	node *ptr=(struct node *)malloc(sizeof(struct node));
	ptr=start;
	if(ptr==NULL){
		printf("Double linked list is empty\n");
		return start;
	}
	else{
		while(ptr!=NULL){
			printf("%d ",ptr->angka);
			ptr=ptr->next;
		}printf("\n");
		return start;
	}
}


struct node *createdoublelinkedlist(struct node *start){
	int num;
	printf("Enter -1 to end\n");
	printf("Enter the data: "); scanf("%d",&num);
	while(num!=-1){
//		node *ptr=(struct node *)malloc(sizeof(struct node));
		node *new_node=(struct node *)malloc(sizeof(struct node));
		new_node->angka=num;
		
		if(start==NULL){
			new_node->previous=NULL;
			new_node->next=NULL;
			start=new_node;
		}
		else{
			node *ptr=(struct node *)malloc(sizeof(struct node));
			ptr=start;
			while(ptr->next!=NULL){
				ptr=ptr->next;
			}
			ptr->next=new_node;
			ptr->previous=start;
			ptr->next->next=NULL;
//			new_node->previous=start;
//			new_node->next=NULL;
			
		}
		printf("Enter the data: "); scanf("%d",&num);
	}
	return start;
	
}

struct node *insertdepan(struct node *start){
	int num;
	node *new_node=(struct node*)malloc(sizeof(struct node));
	printf("Enter the data: "); scanf("%d",&num);
	
	new_node->angka=num;
	new_node->previous=NULL;
	new_node->next=start;
	start=new_node;
	return start;
}

struct node *insertbelakang(struct node *start){
	int num;
	node *new_node=(struct node *)malloc(sizeof(struct node));
	node *ptr=(struct node *)malloc(sizeof(struct node));
	printf("Enter the data: "); scanf("%d",&num);
	new_node->angka=num;
	if(start==NULL){
		new_node->previous=NULL;
		new_node->next=NULL;
		start=new_node;
		return start;
	}
	else{
		ptr=start;
		while(ptr->next!=NULL){
		ptr=ptr->next;
		}
		ptr->next=new_node;
		ptr->previous=start;
		ptr->next->next=NULL;
		return start;
	}

	
	
	
}

struct node* deletee(struct node *start){
	int num;
	printf("Enter the data that you want to delete: "); scanf("%d",&num);
	node *ptrprev=(struct node *)malloc(sizeof(struct node));
	node *ptr=(struct node *)malloc(sizeof(struct node));
	node *del=(struct node *)malloc(sizeof(struct node));
	if(start->angka==num){
		start=start->next;
		start->previous=NULL;
		return start;
	}
	
	else{
		ptr=start;
		while(ptr->next->angka!=num){
			ptr=ptr->next;
		}
		if(ptr->next->next==NULL){
			ptr->next=NULL;
			return start;
		}
		ptrprev=ptr;
		del=ptr->next;
		ptr=ptr->next->next;
		ptrprev->next=ptr;
		ptr->previous=ptrprev;
//		ptrprev->next=ptr->next;
//		ptr->previous=ptrprev;
		
		return start;
	}
	
	
}

int main(){
	char check='y';
	do{
		int x;
		printf("Menu:\n1. Create list\n2. Insert Depan\n3. Insert Belakang\n4. Delete\n");
		printf("Choose: "); scanf("%d",&x);
		
		switch(x){
			
			case 1:
				start=createdoublelinkedlist(start);
				start=display(start);
				printf("Again? (y/n): "); scanf(" %c",&check);
				break;
			case 2:
				start=insertdepan(start);
				start=display(start);
				printf("Again? (y/n): "); scanf(" %c",&check);
				break;
			case 3:
				start=insertbelakang(start);
				start=display(start);
				printf("Again? (y/n): "); scanf(" %c",&check);
				break;
			case 4:
				start=deletee(start);
				start=display(start);
				printf("Again? (y/n): "); scanf(" %c",&check);
				break;
		}
		
	}while(check!='n');
	
	
	
}
