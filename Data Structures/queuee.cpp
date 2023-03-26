#include <stdio.h>
#include <stdlib.h>


struct node{
	int data;
	struct node*next;
};

struct queue{
	struct node*front;
	struct node*rear;
};
//queue*q;

void createQueue(struct queue*q){
	q->front=NULL;
	q->rear=NULL;
}

struct queue*insert(struct queue*q,int val){
	struct node*ptr=(struct node*)malloc(sizeof(struct node));
	
	ptr->data=val;
	if(q->front==NULL){
		q->front=ptr;
		q->rear=ptr;
		q->front->next=q->rear->next=NULL;
	}
	else{
		q->rear->next=ptr;
		q->rear=ptr;
		q->rear->next=NULL;
	}
	return q;
	
	
}
struct queue*deletee(struct queue*q){
	struct node*ptr;
	ptr=q->front;
	if(q->front==NULL){
		printf("Queue is Empty\n");
	}
	else{
		q->front=q->front->next;
		printf("Antrian yang dipanggil/dihapus: %d\n",ptr->data);
		free(ptr);
	}
	return q;
	
	
}
int peek(struct queue*q){
	if(q->front==NULL){
		printf("Queue is Empty\n");
		return -1;
	}
	else return q->front->data;
}

struct queue*display(struct queue*q){
	struct node*ptr;
	ptr=q->front;
	if(ptr==NULL){
		printf("Queue is Empty\n");
		return q;
	}
	while(ptr!=q->rear){
		printf("%d ",ptr->data);
		ptr=ptr->next;
	}
	printf("%d \n",ptr->data);
	return q;
}

int main(){
	queue*q=(struct queue*)malloc(sizeof(struct queue));
	int x;
	createQueue(q);
	do{
		printf("Menu:\n1. INSERT\n2. DELETE\n3. PEEK/TOP\n4. DISPLAY\n5. EXIT\n");
		printf("Pilih apa Anda??: "); scanf("%d",&x);
		switch(x){
			case 1:{
				int val;
				printf("Masukkan Datanya: "); scanf("%d",&val);
				q=insert(q,val);
				system("cls");
				break;
				
			}
				
			
			case 2:{
				q=deletee(q);
				break;
			}
				
				
			case 3:{
				int peekk=peek(q);
				if (peekk== -1){
					printf("Queue is empty\n");
				}
				else{
					printf("Antrian yang bakalan dipanggil/atau bagian teratas: %d\n",peekk);
				}
				break;
			}
			
			
				
			case 4:{
				q=display(q);
				break;
				
			}
			
				
			default:
				break;
				
		}
			
	}while(x!=5);
	printf("Exit...\n");
	
	
	
return 0;
}
