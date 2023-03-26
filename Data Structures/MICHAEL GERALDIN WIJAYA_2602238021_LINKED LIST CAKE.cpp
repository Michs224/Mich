#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct kue{
	char code[10];
	char name[50];
	long long int stock;
	long long int price;
	struct kue*next;
};
struct kuee{
	char code[10];
	char name[50];
	long long int stock;
	long long int price;
}addcake;


void clear(){
    #if defined(_linux) || defined(unix) || defined(APPLE_)
        system("clear");
    #endif

    #if defined(_WIN32) || defined(_WIN64)
        system("cls");
    #endif
}
void pause(){
    #if defined(_linux) || defined(unix) || defined(APPLE_)
    printf("Press any key then enter or just enter to continue . . . ");		
	int c=getchar();
    #endif

    #if defined(_WIN32) || defined(_WIN64)
        system("pause");
    #endif
}


void insert(struct kue **head, char code[],char name[], long long int stock, long long int price){
	struct kue *temp=(struct kue *) malloc(sizeof(struct kue));
	strcpy(temp->code,code); strcpy(temp->name,name);
	
	temp->stock=stock; temp->price=price;
	temp->next=*head;
	*head=temp;
}

int choose;
void display1(struct kue *head){
	if(head==NULL){
		printf("Linked List is empty\n");
		return;
	}
	int i=0;
		printf("\t\t     BLUE CAKE SHOP CASHIER\n");
		printf("================================================================\n");
		printf("No. | Cake Code | Cake Name            | Available | Price\n");
		printf("---------------------------------------------------------------\n");
	while(head!=NULL){
		printf("0%d. | %-9s | %-20s | %9lld | ",i+1,head->code,head->name,head->stock,head->price);
		if(head->price!=0) printf("Rp. %lld,-\n",head->price);
		else printf("   Free!\n");
		head=head->next;
		i++;
	}
	printf("---------------------------------------------------------------\n\n");
		
		printf("Menu :\n1. Sell\n2. Add Stock\n3. Insert Cake\n4. Exit\n");
		printf("Input choice : "); scanf("%d",&choose);
}

void display2(struct kue *head){

	if(head==NULL){
		printf("Linked List is empty\n");
		return;
	}
	int i=0;
		printf("\t\t     BLUE CAKE SHOP CASHIER\n");
		printf("================================================================\n");
		printf("No. | Cake Code | Cake Name            | Available | Price\n");
		printf("---------------------------------------------------------------\n");
	while(head!=NULL){
		printf("0%d. | %-9s | %-20s | %9lld | ",i+1,head->code,head->name,head->stock,head->price);
		if(head->price!=0) printf("Rp. %lld,-\n",head->price);
		else printf("   Free!\n");
		head=head->next;
		i++;
	}
	
	printf("---------------------------------------------------------------\n\n");		
}

void sorting(struct kue *head){
	struct kue *temp1=(struct kue *) malloc(sizeof(struct kue));
	struct kue *temp2=(struct kue *) malloc(sizeof(struct kue));
//	struct kue *temppp=head;
//	struct kue *temp1;
//	struct kue *temp2;
//	struct kue *temppp=(struct kue *) malloc(sizeof(struct kue));
	char tempp[10];
	temp1=head;
	while(temp1->next!=NULL){
	temp2=temp1->next;
		while(temp2!=NULL){
			if(strcmpi(temp1->code,temp2->code)>0){
				strcpy(tempp,temp1->code);
				strcpy(temp1->code,temp2->code);
				strcpy(temp2->code,tempp);
				
				strcpy(tempp,temp1->name);
				strcpy(temp1->name,temp2->name);
				strcpy(temp2->name,tempp);
				
				int temppp=temp1->stock;
				temp1->stock=temp2->stock;
				temp2->stock=temppp;
				
				int temmpp=temp1->price;
				temp1->price=temp2->price;
				temp2->price=temmpp;
			}
			temp2=temp2->next;
		}
		temp1=temp1->next;
	}

}


int check;

void sell(struct kue *head){
	struct kue *temp=head;
	int check=0;
	do{
	clear();
	display2(head);
	printf("-------------------------- SELL MENU ---------------------------\n\n");
	char cust_code[10];
	long long int q;
	printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	
	while(strlen(cust_code)!=5){
		clear();
		printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
		pause();
		clear();
		display2(head);
		printf("-------------------------- SELL MENU ---------------------------\n\n");
		printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	}

	while(temp!=NULL){
		if (strcmp(temp->code,cust_code)==0){
			check=1;
			printf("Input Quantity [0..%lld]: ", temp->stock); scanf("%lld",&q);
			clear();
			while(q<0 || q>temp->stock){
				fflush(stdin);
				printf("...The quantity of cake is not enough, please input again!...\n\n"); 
				pause();
				clear();
				display2(head);
				printf("-------------------------- SELL MENU ---------------------------\n\n");
				printf("Input Quantity [0..%lld]: ", temp->stock); scanf("%lld",&q);clear();
			}
			temp->stock-=q;
			display2(head);
			printf("Total Price is : Rp %lld,- x %lld = Rp %lld,-\n--- Thank You ---\n\n", temp->price,q,temp->price*q);
			break;
		}
		else temp=temp->next;
		
	}
	temp=head;
	if(check==0){
		clear();
		printf("--- The Cake Code doesn't exist, please input again! ---\n\n");
		pause();
	}
}while(check==0);
//	*head=*temp;
//	clear();
//	display2(head);
}

void addstock(struct kue *head){
	struct kue *temp=head;
	int check=0;
	do{
	clear();
	display2(head);
	printf("----------------------- ADD STOCK MENU -------------------------\n\n");
	char cust_code[10];
	long long int q;
	printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	
	while(strlen(cust_code)!=5){
		clear();
		printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
		pause();
		clear();
		display2(head);
		printf("----------------------- ADD STOCK MENU -------------------------\n\n");
		printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	}
	
	while(temp!=NULL){
		if (strcmp(temp->code,cust_code)==0){
			check=1;
			printf("Input Quantity [1..10]: "); scanf("%lld",&q);
			clear();
			while(q<1 || q>10){
				fflush(stdin);
				clear();
				printf("...The quantity of cakes allowed is a minimum of 1 and a maximum of 10, please input again!...\n\n");
				pause();
				clear();
				display2(head);
				printf("----------------------- ADD STOCK MENU -------------------------\n\n"); 
				printf("Input Quantity [1..10]: "); scanf("%lld",&q);
			}
			temp->stock+=q;
			display2(head);
			printf("--- Adding Stock Success ---\n\n");
			break;
		}
		else temp=temp->next;
		
	}temp=head;
	
	if(check==0){
		clear();
		printf("--- The Cake Code doesn't exist, please input again! ---\n\n");
		pause();

	}
	
}while(check==0);
//	*head=*temp;
//	clear();
//	display2(head);	
}


struct kue *insertcake(struct kue *head){
//			struct kue *temp=(struct kue *) malloc(sizeof(struct kue));
			struct kue *temp=head;
			do{	
			clear();
			display2(head);
			printf("------------------------- Add New Cake -------------------------\n\n");
			printf("Input New Cake Code [5 chars]: "); scanf("%s",addcake.code);
//			struct kue *temp=(struct kue *) malloc(sizeof(struct kue));
			while(strlen(addcake.code)!=5){
				clear();
				printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
				pause();
				clear();
				display2(head);
				printf("------------------------- Add New Cake ------------------------\n\n");
				printf("Input New Cake Code [5 chars]: "); scanf("%s",addcake.code);
			}
			
			check=1;
			while(temp!=NULL){
				if(strcmp(temp->code,addcake.code)==0){
					check=0;
					clear();
					printf("--- The Cake Code already exist ---\n\n");
					pause();
					break;
				}
				else temp=temp->next;
			}
			temp=head;
			
		}while(check==0);
			
			printf("Input New Cake Name [Max. 20 chars]: "); scanf(" %[^\n]", addcake.name);
			
			while(strlen(addcake.name)>20){
				clear();
				printf("--- The Cake Name must be a maximum of 20 characters, please input again! ---\n\n");
				pause();
				printf("Input New Cake Name [Max. 20 chars]: "); scanf(" %[^\n]", addcake.name);
			}
			printf("Input the Stock Quantity [Min. 1]: "); scanf("%lld",&addcake.stock);
			
			while(addcake.stock<1){
				fflush(stdin);
				clear();
				printf("...The allowed stock quantity is a minimum of 1, please input again!...\n\n");
				pause();
				clear();
				display2(head);
				printf("----------------------- Add New Cake -------------------------\n\n"); 
				printf("Input Stock Quantity [Min. 1]: "); scanf("%lld",&addcake.stock);
			}
			printf("Input the Price of Cake: "); scanf("%lld",&addcake.price);
				while(addcake.price<0){
				fflush(stdin);
				clear();
				printf("...Enter a valid cake price, please input again!...\n\n");
				pause();
				clear();
				display2(head);
				printf("----------------------- Add New Cake -------------------------\n\n"); 
				printf("Input the Price of Cake: "); scanf("%lld",&addcake.price);clear();
			}
			
			if(check==1){
				insert(&head,addcake.code,addcake.name,addcake.stock,addcake.price);
				clear();
				sorting(head);
				clear();
				display2(head);
				printf("--- Inserting New Cake Success ---\n\n");
				return head;
				
			}

	
}


int main(){
	struct kue *head=NULL;
	
	insert(&head,"CK023","Strawberry Shortcake",7,17500);
	insert(&head,"CK017","Mayonaise Cake",24,30000);
	insert(&head,"CK009","Chocochip Cake",5,20000);
	insert(&head,"CK001","Blueberry Cake",13,25000);
		
char x='y';
while(x!='n'){
	display1(head);
	fflush(stdin);
	switch(choose){
	case 1:
		sell(head);
		printf("Do you want to do it again? (y/n): "); scanf(" %c",&x);
		clear();
		while(x!='y' && x!= 'n'){
		printf("Please input y/n!\ny: yes\nn: no:\nInput: ");scanf(" %c",&x);
		clear();
		}
		break;

	case 2:
		addstock(head);
		printf("Do you want to do it again? (y/n): "); scanf(" %c",&x);
		clear();
		while(x!='y' && x!= 'n'){
		printf("Please input y/n!\ny: yes\nn: no:\nInput: ");scanf(" %c",&x);
		clear();
		}
		break;
		
	case 3:
		head=insertcake(head);
		printf("Do you want to do it again? (y/n): "); scanf(" %c",&x);
		clear();
		while(x!='y' && x!= 'n'){
		printf("Please input y/n!\ny: yes\nn: no:\nInput: ");scanf(" %c",&x);
		clear();
		}
		break;
	case 4:
		clear();
		printf("Thank you for using this program!\n\n%17c%c\n\n",2,7);
		printf("\t     Exit...\n");
		exit(0);
		break;
		
	default:
		clear();
		printf("Invalid input, please enter the available options!\n\n");
		pause();
		clear();
		break;
		
		
	}
}
	fflush(stdin);
	printf("Thank you for using this program!\n\n%17c%c\n\n",2,7);
	printf("\t     Exit...\n");
	return 0;
}
