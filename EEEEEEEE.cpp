#include <stdio.h>

long long Menang(long long int boss[],int stage,long long int jojo,int menang){
	if(jojo>=boss[stage]){
		menang++;
		jojo=boss[stage];
	}
	if(stage==0){
		return menang;
	}else return Menang(boss,stage-1,jojo,menang);
}


int main(){
	int M;
	scanf("%d",&M);
	long long int B[101];
	for(int x=0;x<M;x++){
		scanf("%ld",&B[x]);
	}
	for(int i=0;i<M;i++){
		for(int j=M-1;j>i;j--){
			if(B[j-1]>B[j]){
				int tukar=B[j];
				B[j]=B[j-1];
				B[j-1]=tukar;
			}
		}
	}
	long long int jojo;
	int menang=0;
	scanf("%ld",&jojo);
	menang=Menang(B,M-1,jojo,menang);
	printf("%d\n",menang);
	return 0;
}
