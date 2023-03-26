#include <stdio.h>

struct data{
	char matk[100];
	int dl;
}matkul[1001],tukar;


int main(){
	int N,i,j;
	scanf("%d",&N);
	for(i=0;i<N;i++){
		scanf("%s %d",matkul[i].matk,matkul[i].dl);
	}
	

	for(i=1;i<N;i++){
		int temp=matkul[i].dl;
		j=i-1;
		while(j>=0 && temp<matkul[j].dl){
			matkul[j+1]=matkul[j];
			j--;
		}
		matkul[j+1]=temp;
		
	}
	
	for(i=0;i<N;i++){
		printf("%d",matkul[i]);
	}
	
	return 0;
}
