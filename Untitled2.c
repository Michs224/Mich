#include <stdio.h>

int main(){
	int N,i,c;
	char s[100];
	c=0;
	scanf("%d\n",&N);
	for(i=0;i<N;i++){
		scanf("%c",&s[i]);
	}
	printf("%s\n",s);
	for(i=0;i<N;i++){
		if (s[i]==s[N-1-i]) c++;
	}
	if(c==N){
	printf("Yes");}
	else {
	printf("No");}
	

	return(0);
	
}
