#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <cstdlib>

struct kue{
	char code[10];
	char name[50];
	long long int stock;
	long long int price;
}kuee[1001],addcake;


void clear(){
    #if defined(__linux__) || defined(__unix__) || defined(__APPLE__)
        system("clear");
    #endif

    #if defined(_WIN32) || defined(_WIN64)
        system("cls");
    #endif
}
void pause(){
    #if defined(__linux__) || defined(__unix__) || defined(__APPLE__)
    printf("Press any key then enter or just enter to continue . . . ");		
	int c=getchar();
    #endif

    #if defined(_WIN32) || defined(_WIN64)
        system("pause");
    #endif
}

int n=4;

int choose;
void viewmenu1(){
		
		printf("\t\t     BLUE CAKE SHOP CASHIER\n");
		printf("================================================================\n\n");
		printf("No. | Cake Code | Cake Name            | Available | Price\n");
		printf("---------------------------------------------------------------\n");
		for(int i=0;i<n;i++){
			printf("0%d. | %-9s | %-20s | %9lld | Rp. %lld,-\n",i+1,kuee[i].code,kuee[i].name,kuee[i].stock,kuee[i].price);	
		}
		printf("---------------------------------------------------------------\n\n");
		
		printf("Menu :\n1. Sell\n2. Add Stock\n3. Update Cake\n4. Exit\n");
		printf("Input choice : "); scanf("%d",&choose);
}

void viewmenu2(){
		
		printf("\t\t     BLUE CAKE SHOP CASHIER\n");
		printf("================================================================\n\n");
		printf("No. | Cake Code | Cake Name            | Available | Price\n");
		printf("---------------------------------------------------------------\n");
		for(int i=0;i<n;i++){
			printf("0%d. | %-9s | %-20s | %9lld | ",i+1,kuee[i].code,kuee[i].name,kuee[i].stock,kuee[i].price);
			if(kuee[i].price!=0) printf("Rp. %lld,-\n",kuee[i].price);
			else printf("   Free!\n");
		}
		printf("---------------------------------------------------------------\n\n");
		
}

kue change;

void sorting(struct kue cake[],int n){
	
	for(int i=0;i<n;i++){
		for(int j=n-1;j>i;j--){
			if(strcmpi(cake[j-1].code,cake[j].code)>0){
				change=cake[j];
				cake[j]=cake[j-1];
				cake[j-1]=change;
			}
		}
	}
		
}

void sell(){
	int check=0;
	
	do{
	clear();
	viewmenu2();
	printf("-------------------------- SELL MENU ---------------------------\n\n");
	char cust_code[10];
	long long int q;
	printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	
	while(strlen(cust_code)!=5){
		clear();
		printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
		pause();
		clear();
		viewmenu2();
		printf("-------------------------- SELL MENU ---------------------------\n\n");
		printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	}

	for(int i=0;i<n;i++){
		if (strcmp(kuee[i].code,cust_code)==0){
			check=1;
			printf("Input Quantity [0..%lld]: ", kuee[i].stock); scanf("%lld",&q);
			clear();
			while(q<0 || q>kuee[i].stock){
				fflush(stdin);
				printf("...The quantity of cake is not enough, please input again!...\n\n"); 
				pause();
				clear();
				viewmenu2();
				printf("-------------------------- SELL MENU ---------------------------\n\n");
				printf("Input Quantity [0..%lld]: ", kuee[i].stock); scanf("%lld",&q);clear();
			}
			kuee[i].stock-=q;
			printf("Total Price is : Rp %lld,- x %lld = Rp %lld,-\n--- Thank You ---\n\n", kuee[i].price,q,kuee[i].price*q);
		}
		
		
	}
	if(check==0){
		clear();
		printf("--- The Cake Code doesn't exist, please input again! ---\n\n");
		pause();
	}
}while(check==0);

	
}

void addstock(){
	int check=0;
	
	do{
	clear();
	viewmenu2();
	printf("----------------------- ADD STOCK MENU -------------------------\n\n");
	char cust_code[10];
	long long int q;
	printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	
	while(strlen(cust_code)!=5){
		clear();
		printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
		pause();
		clear();
		viewmenu2();
		printf("----------------------- ADD STOCK MENU -------------------------\n\n");
		printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	}
	
	for(int i=0;i<n;i++){
		if (strcmp(kuee[i].code,cust_code)==0){
			check=1;
			printf("Input Quantity [1..10]: "); scanf("%lld",&q);
			clear();
			while(q<1 || q>10){
				fflush(stdin);
				printf("...The quantity of cakes allowed is a minimum of 1 and a maximum of 10, please input again!...\n\n");
				pause();
				clear();
				viewmenu2();
				printf("----------------------- ADD STOCK MENU -------------------------\n\n"); 
				printf("Input Quantity [0..10]: "); scanf("%lld",&q);clear();
			}
			kuee[i].stock+=q;
			printf("--- Adding Stock Success ---\n\n");
		}
		
	}
	
	if(check==0){
		clear();
		printf("--- The Cake Code doesn't exist, please input again! ---\n\n");
		pause();
	}
	
}while(check==0);
	
	
}


void removecake(){
			clear();
			viewmenu2();
			printf("------------------------- Remove Cake --------------------------\n\n");
			char cust_code[10];
			printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
	
			while(strlen(cust_code)!=5){
				clear();
				printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
				pause();
				clear();
				viewmenu2();
				printf("------------------------- Remove Cake -------------------------\n\n");
				printf("Input Cake Code [5 chars]: "); scanf("%s",cust_code);
			}
			int check=0;
			for(int i=0;i<n;i++){
				if (strcmp(kuee[i].code,cust_code)==0){
					int k=i;
					for(int i=k;i<n-1;i++){
						kuee[i]=kuee[i+1];
					}
					n--;
					check=1;
					clear();
		}

		
	}
			if(check==0){
			clear();
			printf("--- The Cake Code doesn't exist, please input again! ---\n\n");
			pause();
		}
		else {
		clear();
		viewmenu2();
		printf("--- Removing Cake Success ---\n\n");
		}
		
		
}


void addnewcake(){
			clear();
			viewmenu2();
			printf("------------------------- Add New Cake -------------------------\n\n");
			printf("Input New Cake Code [5 chars]: "); scanf("%s",addcake.code);
	
			while(strlen(addcake.code)!=5){
				clear();
				printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
				pause();
				clear();
				viewmenu2();
				printf("------------------------- Add New Cake ------------------------\n\n");
				printf("Input New Cake Code [5 chars]: "); scanf("%s",addcake.code);
			}
			int check=1;
			for(int i=0;i<n;i++){
				if(strcmp(kuee[i].code,addcake.code)==0){
					check=0;
					clear();
					printf("--- The Cake Code already exist ---\n\n");
					pause();
				}
			}
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
				viewmenu2();
				printf("----------------------- Add New Cake -------------------------\n\n"); 
				printf("Input Stock Quantity [Min. 1]: "); scanf("%lld",&addcake.stock);clear();
			}
			printf("Input the Price of Cake: "); scanf("%lld",&addcake.price);
				while(addcake.price<0){
				fflush(stdin);
				clear();
				printf("...Enter a valid cake price, please input again!...\n\n");
				pause();
				clear();
				viewmenu2();
				printf("----------------------- Add New Cake -------------------------\n\n"); 
				printf("Input the Price of Cake: "); scanf("%lld",&addcake.price);clear();
			}
			
			if(check==1){
				n++;
				kuee[n-1]=addcake;
				clear();
				sorting(kuee,n);
				viewmenu2();
				printf("--- Adding New Cake Success ---\n\n");
			}
	
	
}

void updatepricecake(){
			clear();
			viewmenu2();
			long long int newprice;
			printf("------------------------- Update Price Cake -------------------------\n\n");
			printf("Input Cake Code [5 chars]: "); scanf("%s",addcake.code);
	
			while(strlen(addcake.code)!=5){
				clear();
				printf("--- The Cake Code must consist of 5 characters, please input again! ---\n\n");
				pause();
				clear();
				viewmenu2();
				printf("------------------------- Update Price Cake ------------------------\n\n");
				printf("Input Cake Code [5 chars]: "); scanf("%s",addcake.code);
			}
			
			int check=0;
			for(int i=0;i<n;i++){
				if(strcmp(kuee[i].code,addcake.code)==0){
					check=1;
					clear();
					printf("Input the New Price of Cake: "); scanf("%lld",&newprice);
					while(newprice<0){
						clear();
						printf("Cake Price must be at least 0 (free), please input again!\n\n");
						pause();
						clear();
						printf("Input the New Price of Cake: "); scanf("%lld",&newprice);
					}
					kuee[i].price=newprice;
				}
			}
			if(check==0){
			clear();
			printf("--- The Cake Code doesn't exist, please input again! ---\n\n");
			pause();
			clear();
			}
			else {
			clear();
			viewmenu2();
			printf("--- Updating Cake Price Success ---\n\n");
			}
			fflush(stdin);
}	


void updatecake(){
	int check=0;
	int choosee;
	char x='y';
	
	while(x!='n'){

	do{	
	labelupdatecake:
	clear();
	fflush(stdin);
	viewmenu2();
	printf("----------------------- UPDATE CAKE MENU -----------------------\n");
	printf("1. Remove Cake\n2. Add New Cake\n3. Update Cake Price\n4. Back to Previous Menu\n");
	printf("Input Choice : "); scanf("%d",&choosee);
	
	switch(choosee){
		case 1:
			removecake();
			printf("Do you want to update cake again? (y/n): "); scanf(" %c",&x);
			clear();
			while(x!='y' && x!='n'){
				printf("Please input y/n!\ny: yes\nn: no\nInput: ");scanf(" %c",&x);
				clear();
			}
			break;
			
		case 2:
			addnewcake();
			printf("Do you want to update cake again? (y/n): "); scanf(" %c",&x);
			clear();
			while(x!='y' && x!='n'){
				printf("Please input y/n!\ny: yes\nn: no\nInput: ");scanf(" %c",&x);
				clear();
			}
			break;
			
		case 3:
			updatepricecake();
			printf("Do you want to update cake again? (y/n): "); scanf(" %c",&x);
			clear();
			while(x!='y' && x!='n'){
				printf("Please input y/n!\ny: yes\nn: no\nInput: ");scanf(" %c",&x);
				clear();
			}
			if(x=='n')return;
			
			break;
		
		case 4:
			fflush(stdin);
			check=1;
			x='n';
			clear();
			viewmenu2();
			printf("Menu :\n1. Sell\n2. Add Stock\n3. Update Cake\n4. Exit\n\n");
			break;
		
		default:
			clear();
			printf("Invalid input, please enter the available options!\n\n");
			pause();
			clear();
			break;
			

	}	
	
}while(x!='n');

}
fflush(stdin);

}


int main(){	
	strcpy(kuee[0].code,"CK001"); 	strcpy(kuee[0].name,"Blueberry Cake");
	strcpy(kuee[1].code,"CK009"); 	strcpy(kuee[1].name,"Chocochip Cake");
	strcpy(kuee[2].code,"CK017"); 	strcpy(kuee[2].name,"Mayonaise Cake");
	strcpy(kuee[3].code,"CK023"); 	strcpy(kuee[3].name,"Strawberry Shortcake");
	
	kuee[0].stock=13; 	kuee[0].price=25000; 
	kuee[1].stock=5; 	kuee[1].price=20000; 
	kuee[2].stock=24; 	kuee[2].price=30000; 
	kuee[3].stock=7; 	kuee[3].price=17500; 
	
	char x='y';
	while(x!='n'){
		viewmenu1();
		fflush(stdin);
			
		switch(choose){
			case 1:
				sell();
				printf("Do you want to do it again? (y/n): "); scanf(" %c",&x);
				clear();
				while(x!='y' && x!= 'n'){
					printf("Please input y/n!\ny: yes\nn: no:\nInput: ");scanf(" %c",&x);
					clear();
				}
				break;
				
			case 2:
				addstock();
				printf("Do you want to do it again? (y/n): "); scanf(" %c",&x);
				clear();
				while(x!='y' && x!= 'n'){
					printf("Please input y/n!\ny: yes\nn: no\ninput: ");scanf(" %c",&x);
					clear();
				}
				break;
				
			case 3:
				updatecake();
				viewmenu2();
				printf("Menu :\n1. Sell\n2. Add Stock\n3. Update Cake\n4. Exit\n\n");
				printf("Do you want to do it again? (y/n): "); scanf(" %c",&x);
				clear();
				while(x!='y' && x!= 'n'){
					printf("Please input y/n!\ny: yes\nn: no\ninput: ");scanf(" %c",&x);
					clear();
				}
				break;
				
			case 4:
				clear();
				printf("Thank you for using this program!\n\n%17c\n\n",3);
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
	printf("Thank you for using this program!\n\n%17c\n\n",3);
	printf("\t     Exit...\n");
	return 0;
}

