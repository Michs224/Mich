#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct plant{
	char name[101];
	char plt[100];
}plants[100];

struct nama1{
	char namme[101];
}namm[100];

//void plts(struct *plants, char *str,int T,int N){
//	
//	for(int i=0;i<T;i++){
//		for(int j=0;j<N;j++){
//			if(strcmp(str[i],plants[j].name)!= NULL){
//				printf("%s",plants[j].plt);
//			}
//		}
//	}
//}

int main(){

	int N,T;
	FILE *data=fopen("testdata.in","r");
	fscanf(data,"%d\n",&N);
	
	for(int i=0;i<N;i++){
		fscanf(data,"%[^\#]#%[^\n]\n",&plants[i].name,&plants[i].plt);
	}
//	char str[100];

	fscanf(data,"%d",&T);
	for(int i=0;i<T;i++){
		fscanf(data,"%s\n",&namm[i].namme);
	}
	
//	plts(plants,str,T,N);
int record,x;
char re[101];
for(int i=0;i<T;i++){
	record=0;
		for(int j=0;j<N;j++){
			if(strcmp(plants[j].name,namm[i].namme)==NULL){
				record=1;
				x=j;
			}

		}
		if(record==1) printf("Case #%d: %s\n",i+1,plants[x].plt);
		else printf("Case #%d: N/A\n",i+1);
		
	}
	
	
	fclose(data);
	return(0);
}
