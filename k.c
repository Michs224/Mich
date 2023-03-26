#include <stdio.h>
#include <string.h>

int main(){
	
	int T,i,a,k;
	char x[1000],ss[1000];

	
	scanf("%d",&T);
	for(a=1;a<=T;a++){
		scanf("%s",&ss);
		k=0;
		for(i=0;i<strlen(ss);i++){
		 x[i]=ss[k];
		 k++;
		 
	} 
	printf("Case #%d : %s\n",a,strrev(x));
}
	return (0);
}
