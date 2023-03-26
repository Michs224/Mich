#include <stdio.h>

struct data{
	int Q;
	char altmusk[100];
	int prc;
}alatm[1001],tukar;


int main(){
	FILE*data=fopen("testdata.in","r");
	int T,N,i,j,jlh=0;
	fscanf(data,"%d",&T);
	for(i=0;i<T;i++){
		jlh=0;
		fscanf(data,"%d",&N);
		for(j=0;j<N;j++){
			fscanf(data,"%d#%[^\@]@%d\n",&alatm[j].Q,&alatm[j].altmusk,&alatm[j].prc);
			jlh+=alatm[j].Q*alatm[j].prc;
		
//			printf("%d %d\n",alatm[j].prc, jlh);
		}	
//		int x=0,jlh=0;
//		for(j=0;j<N;j++){
//		jlh+=alatm[j].Q*alatm[j].prc;
//		}
	 	int x=0.15*jlh;
		printf("Customer #%d: Rp %d\n",i+1,jlh-x);
//		jlh=0;
		
	
	}
		fclose(data);
		return 0;
}
