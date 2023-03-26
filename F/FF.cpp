#include <stdio.h>

int main(){
	FILE*data=fopen("testdata.in","r");
	int A,B;
	
	fscanf(data,"%d %d",&A,&B);
	
	printf("%d\n",A+B);
	
}
