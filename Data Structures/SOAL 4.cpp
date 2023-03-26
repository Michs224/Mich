#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <conio.h>


//Sorry menurut saya sendiri waktu yang diberikan untuk membuat 4 program tersebut tidak cukup

int main(){
	int choose;
	do{
		printf("VALIDAS\n1. Enter Apps\n2. Exit\n>>"); scanf("%d",&choose);
		switch(choose){
			case 1:{
				int choose2;
				char shoesname[100];
				do{
				printf("1. Add Shoes\n2. View All Shoes\n3. Back\n>>"); scanf("%d",choose2);
				switch(choose2){
					case 1:{
						int check=0;
						do{
	
							printf("Insert shoes name [Must be two words]: "); scanf(" %[^\n]",shoesname);
							for(int i=0;i<strlen(shoesname);i++){
								if(shoesname[0]<97 || shoesname[0]>122){
									check=1;
								}
								if(shoesname[i]==' '){
									if(shoesname[i+1]<97 || shoesname[i+1]>122){
										check=1;
									}
								}
							}
							if(check==1){
								printf("Input must consist of two words with the first letter of each word capital\n");
							}
						}while(check!=0);
						do{
							printf("Insert shoes type: ");
						}while(shoestype!="Formal" && shoestype!="Casual" && shoestype!="Sport")
						do{
							printf("Insert shoes price: ");
						}while(shoesprice <1000 || shoesprice>3000);
						break;
					}
					case 2:{
						
						break;
					}
					default:{
						printf("Input must between 1-3\n");
						system("pause");
						break;
					}
				}	
				}while(choose !=3);
				
				break;
			}
			
			case 2:{
				
				break;
			}
				
				
		}
	}while(choose!=2);
	printf("Thank You for using the APP\n");
	
	
	return 0;
}
