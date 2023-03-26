#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct Std{
	char nim[101];
	char name[101];
}stds[1001];


int main(){
	FILE *student=fopen("testdata.in","r");
	int N;
	fscanf(student,"%d",&N);
	for(int i=0; i<N;i++){
		fscanf(student,"%s %s",&stds[i].nim, &stds[i].name);
	}
	
	struct Std tukar;	
	for(int i=1;i<N;i++){
		for(int j=N-1;j>=i;j--){
		
			if (strcmp(stds[j-1].nim,stds[j].nim)>0){
			tukar =stds[j];
			stds[j]=stds[j-1];
			stds[j-1]=tukar;
			}
		}
		
	}
	
	for(int i=0;i<N;i++){
		printf("%s %s\n",stds[i].nim,stds[i].name);
	}
	fclose(student);
	return 0;
}
