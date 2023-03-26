#include <stdio.h>
#include <stdlib.h>


struct node{
	int angka;
	char name[100];
	struct node *next;
	
};
struct node *start=NULL;

void display(struct node *start){
	if(start==NULL){
		printf("Linked list is empty\n");
		return;
	}
	while(start!=NULL){
		printf("%d ",start->angka);
		start=start->next;
	}printf("\n");
}

struct node *createlist(struct node *start){
		int num;
		printf("Enter -1 to end:\n");
		printf("Enter the data: "); scanf("%d",&num);
		
//		struct node *ptr;
		
		while(num!=-1){
			struct node *new_node=(struct node*)malloc(sizeof(struct node));
			new_node->angka=num;
			
			if(start==NULL){
				new_node->next=NULL;
				start=new_node;
			}
			
			else{
				struct node *ptr=(struct node*) malloc(sizeof(struct node));
				ptr=start;
				while(ptr->next!=NULL)ptr=ptr->next;
				ptr->next=new_node;
				ptr->next->next=NULL;
//				ptr=ptr->next;
//				ptr->next=NULL;
//				new_node->next=NULL;
		
				
				
			}
			printf("Enter the data: "); scanf("%d",&num);
		}
		return start;
}

struct node *insert(struct node *start){
	int num;
	printf("Enter the data: "); scanf("%d",&num);
	node *new_node=(struct node*) malloc(sizeof(struct node));
	new_node->angka=num;
	new_node->next=start;
	start=new_node;
	return start;
}

struct node *deletee(struct node *start){
	int num;
	printf("Data want to delete: "); scanf("%d",&num);
	struct node *ptr;
	ptr=start;

		if(ptr->angka==num){
			ptr=ptr->next;
			start=ptr;
		 return start;
	}
		else{
			node *prevptr=(struct node*)malloc(sizeof(struct node));
			while(ptr->angka!=num){
				prevptr=ptr;
				ptr=ptr->next;
			}
			prevptr->next=ptr->next;

			return start;
		}
	


}

int main(){	
char again;
	do{

	printf("Menu: \n1. Create List\n2. Insert\n3. Delete\n");
	int x;
	scanf("%d",&x);
	switch(x){
		case 1:
		start=createlist(start);
		display(start);
		printf("Lagi? (y/n): "); scanf(" %c",&again);
		break;
		
		case 2:
			start=insert(start);
			display(start);
			printf("Lagi? (y/n): "); scanf(" %c",&again);
			break;
		
		case 3:
			start=deletee(start);
			display(start);
			printf("Lagi? (y/n): "); scanf(" %c",&again);
			break;
		
	}
}while(again!='n');

	return 0;
}
