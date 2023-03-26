#include <stdio.h>

struct data{
	char matk[100];
	int dl;
}matkul[1001],tukar;


int main(){
	int N,i,j;
	scanf("%d",&N);
	for(i=0;i<N;i++){
		scanf("%s %d",matkul[i].matk,&matkul[i].dl);
	}
	
	for(i=0;i<N;i++){
		for(j=N-1;j>i;j--){
			if(matkul[j-1].dl>matkul[j].dl){
				tukar=matkul[j];
				matkul[j]=matkul[j-1];
				matkul[j-1]=tukar;
			}
			if(matkul[j-1].dl==matkul[j].dl){
				if(strcmp(matkul[j-1].matk,matkul[j].matk)>0){
					tukar=matkul[j];
					matkul[j]=matkul[j-1];
					matkul[j-1]=tukar;
				}
			}
		}
	}
//	for(i=1;i<N;i++){
//		temp=matkul[i].dl;
//		j=i-1;
//		while(j>=0 && temp<matkul[j].dl){
//			matkul[j+1]=matkul[j];
//			j--;
//		}
//		matkul[j+1]=temp;
//		
//	}
	
	for(i=0;i<N;i++){
		printf("%s %d\n",matkul[i].matk,matkul[i].dl);
	}
	
	return 0;
}
