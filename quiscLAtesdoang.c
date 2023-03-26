#include <stdio.h>

int main(){
	int N,i,c,b,g;
	char s[100];
	c=0;
	scanf("%d\n",&N);
	for(i=0;i<N;i++){
		scanf("%c",&s[i]);
	}
	for(i=0;i<N;i++){
		if (s[i]==s[N-1-i]) c++;
	}
	for(i=0;i<N;i++){
		b=s[i];
		if (b<48 || b>57) g++;
	}
	if(g==0){
		if(c==N){
		printf("Yes");}
		else {
	printf("No");}
    }else{
    	printf("Not Valid");
	}

	
	return(0);
	
}
