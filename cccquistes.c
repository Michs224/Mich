#include <stdio.h>
#include <string.h>

int main (){
	int T,i,j;
	char s[1001],x,z;
	
	scanf("%d\n",&T);

	for(i=0;i<T;i++){

		scanf("%[^\n]\n",s);
		scanf("%c",&x);
		fflush(stdin);
		if(x>=65 && x<=90){
			x=x+32;
			z=x;
			x=x-32;
		}
		else if(x>=97 && x<=122){
			x=x-32;
			z=x;
			x=x+32;
		}
		for(j=0;j<strlen(s);j++){
			if(s[j]==x){
			s[j]=z;
			}
		}
		printf("%s\n",s);
	

	}
	return(0);
}
