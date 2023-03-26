#include <stdio.h>
#include <stdlib.h>

struct stack{
	int data;
	struct stack *next;
};

struct stack *top=NULL;

struct stack *push(struct stack *top,int val){
	struct stack *ptr=(struct stack*) malloc(sizeof(struct stack));
//	ptr=top;
	ptr->data=val;
	if(top==NULL){
		ptr->next=NULL;
		top=ptr;
//		top->data=val; //gakbisa
//		top->next=NULL;
	}
	
	else{
		ptr->next=top;
		top=ptr;
	}
	
	return top;
	
}

struct stack *pop(struct stack *top){
	struct stack *ptr=(struct stack*) malloc(sizeof(struct stack));
	ptr=top;
	if(top==NULL){
		printf("Stack is empty\n");
	}
	else{
		top=top->next;
		printf("Data yang di pop: %d",ptr->data);
	}
	
	return top;
}

int peek(struct stack *top){
	if(top==NULL)return -1;	
	else return top->data;
	
	
}
void display(struct stack *top){
	struct stack *ptr=(struct stack*) malloc(sizeof(struct stack));
	ptr=top;
	if(ptr==NULL){
		printf("Stack is Empty\n");
		return;
	}
	while(ptr!=NULL){
		printf("%d ",ptr->data);
		ptr=ptr->next;
	}
//	return top;
}

void menu(){
	int x;
	printf("Menu:\n1. PUSH\n2. POP\n3. PEEK/TOP\n4. DISPLAY\n5. EXIT\n");
	
}

int main(){
		int x;
	do{
	menu();
	printf("Pilih: "); scanf("%d",&x);
	switch(x){
		case 1:
			int val;
			printf("Nilai yang ingin dimasukkan: "); scanf("%d",&val);
			top=push(top,val);
			break;
		case 2:
			top=pop(top);
			break;
		case 3:
			val =peek(top);
			if(val!=-1)printf("Data teratas adalah: %d\n",val);
			else printf("Stack is Empty\n");
			break;
		case 4:
			display(top);
			break;
		default:
			break;
			
	}
	}while(x!=5);
	printf("Exit...\n");

	
	
	return 0;
}
