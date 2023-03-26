#include <stdio.h>
#include <ctype.h>



int matriks(int n, int m,int arr[][100],int count){
	for(int i=0;i<n;i++){
		for(int j=0;j<m;j++){
			printf("Masukkan matriks baris ke-%d kolom ke-%d: ",i+1,j+1); scanf("%d",&arr[i][j]);
			count+=arr[i][j];
		}
	}
	printf("\nHasil matriks:\n");
	for(int i=0;i<n;i++){
		for(int j=0;j<m;j++){
			printf("| ");
			if(j<m-1){
				printf("%d ",arr[i][j]);
			}
			else printf("%d",arr[i][j]);
		}
		printf(" |\n");
	}
	return count;
}
//int main(){
////	int a=10,b=9;
////	
////	printf("%d\n",a << 2);
////	printf("%d\n",++a);
//	
//	printf("====================\n");
//	printf("|| Validasi Input ||\n");
//	printf("====================\n");
//	int umur;
//	char gender;
//	do{
//	printf("Masukkan umur [>= 0]: "); scanf("%d",&umur);	
//	}while(umur<0);
//	
//	do{
//	printf("Masukkan jenis kelamin [L atau P]: ");scanf(" %c",&gender); getchar(); 
//	}while(gender!= 'L' && gender != 'P');	
//	
//	if(gender=='P'){
//		printf("Saya seorang perempuan berumur %d tahun!\n",umur);
//	}
//	else printf("Saya seorang laki-laki berumur %d tahun!\n",umur);
////	getchar();
//	printf("Tekan enter untuk mengakhiri..."); getchar();
//	return 0;
//}


int main(){
	int c=10;

if(isalnum(c)) printf("Digit\n");
else printf("Not Digit\n");

	int choice,n,m,arr[100][100],count=0;
	
	do{
	printf("Pilih ukuran matriks:\n1. 3x3\n2. 4x4\nPilih: ");
	scanf("%d",&choice);
	switch(choice){
		case 1:
			count=matriks(3,3,arr,count);
			printf("Sum matriks: %d\n",count);
			getchar();
			printf("Enter enter untuk mengakhiri..."); getchar();
			break;
		case 2:
			count=matriks(4,4,arr,count);
			printf("Sum matriks: %d\n",count);
						getchar();
			printf("Enter enter untuk mengakhiri..."); getchar();
			break;
		default:
			break;
		
			
	}
	}while(choice!=1 && choice !=2);
	
	return 0;
}
