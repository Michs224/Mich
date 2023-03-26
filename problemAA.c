#include <stdio.h>
#include <string.h>
int main()
{
	int T,i;
	int N;
	char name[100];
	scanf("%d\n",&T);
	
	for(i=0;i<T;i++){
		scanf("%d\n",&N);
		scanf("%[^\n]",name);
		for(N=0;N<strlen(name);N++){
			if(name[N]>=97 && name[N]<=122) printf("%c",name[N]);
		}
	}
	return(0);
}
