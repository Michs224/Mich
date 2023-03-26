#include <stdio.h>
#include <string.h>

struct Std{
	int nim;
	char name[21];
}stds[100];


int main(){
	FILE*student;
	student= fopen("testdata.in","r");
	int N;
	fscanf(student,"%d\n",N);
	for(int i=0; i<N;i++){
		fscanf(student,"%d %s\n",&stds[i].nim, &stds[i].name);
	}
	
	struct Std tukar;	
	for(int i=0;i<N;i++){
		for(int j=N-1;j>i;j--){
		
			if (stds[j-1].nim > stds[j].nim){
			tukar =stds[j-1];
			stds[j-1]=stds[j];
			stds[j]=tukar;
			
//			char tempname[21];
//			tempname=stds[j-1].name;
//			stds[j-1].name=stds[j].name;
//			stds[j].name=tempname;
			}
		}
		
	}
	
	for(int i=0;i<N;i++){
		printf("%d %s",stds[i].nim,stds[i].name);
	}
	fclose(student);
	return 0;
}
