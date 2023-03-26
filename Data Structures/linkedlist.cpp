#include <stdio.h>
#include <stdlib.h>

struct node{
	int angka;
	struct node *next;
};
//
//
//int main(){
//	
//	struct node *head=(struct node*) malloc(sizeof(struct node));
//	struct node *second=(struct node*) malloc(sizeof(struct node));
//	head->angka=10;
//	head->next=second;
//
//	second->angka=5;
//	second->next=NULL;
//
//	printf("%d %d",head->angka,second->angka);
//	return 0;
//}

void deleteedepan(struct node **test){
	
	struct node *temp=*test;
	if(*test==NULL){
		printf("Linked list is empty\n");
		return;
	}
	*test=(*test)->next;
		
	
}

void deletetertentu(struct node **test, int val){
	node *temp1=*test;
	while(temp1!=NULL){
		if((temp1)->next->angka==val || temp1->angka==val){
			break;
		}
		temp1=temp1->next;
	}
	
	if(temp1->angka==val){
	*test=(*test)->next;
	}
	else if(temp1!=NULL){
		node *temp2=temp1->next;
		temp1->next=temp2->next;
		temp2->next=NULL;
		free(temp2);
	}
	
}

void insert(struct node **test, int val){
	struct node *temp=(struct node *) malloc(sizeof(struct node));
	temp->angka=val;
	temp->next=*test;
	*test=temp;
}

void display(struct node *test){
	while(test!=NULL){
		printf("%d ",test->angka);
		test=test->next;
		
	}
}

int main(){
	struct node *head=NULL;
	for(int i=0;i<5;i++){
		insert(&head, i);
	}
	
	printf("Sebelum dihapus: "); display(head);
	printf("\n");
	deletetertentu(&head,2);
//	deleteedepan(&head);

	
	printf("Sesudah dihapus: "); display(head);
	return 0;
}
