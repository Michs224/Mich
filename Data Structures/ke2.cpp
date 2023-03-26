#include <stdio.h>

int main(){
	int y;
	printf("1. Enter Program\n2. Close Program\n>>");scanf("%d",&y);
	switch(y){
		case 1:
		int x;
	
	printf("Menu: \n1. Create New Wallet2. View all wallets\.3. Back\n>>"); scanf("%d",&x);
	
	switch(x){
		case 1:
			char material[100];
			int walletprice;
			char wallcode[100];
			printf("Input wallet materi\al |Leather|Suede|Artificial|Textile|: "); scanf("%s",material);
			do{
				printf(">>"); scanf("%s",material);
				if(material!="Leather" && material!="Suede" && material!="Artificial" &&  material!="Textile"){
					printf("Invalid Material\n");
				}
			}while(material!="Leather" && material!="Suede" && material!="Artificial" &&  material!="Textile");
			printf("Input wallet price |15000 to 20000|: "); 
			do{
				printf(">>"); scanf("%d",&walletprice);
				if(walletprice<15000 || walletprice >20000){
					printf("Price is out of specified range\n");
				}
			}while(walletprice<15000 || walletprice >20000);

			
			printf("Input wallet code format |XXAAAA| X: Capital letter, A: Integer from 0-9: "); 
			printf(">>");  scanf("%s",wallcode);
	

	}
//		case 2:
			
	}
	
	

	
	
return 0;
	
}
