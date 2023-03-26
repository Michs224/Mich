#include <stdio.h>
#include <string.h>

int main(){
	char o1[100],o2[100],J[100];

	scanf("%[^ ] %[^ ] %[^\n]",o1,o2,J);
//	scanf("%s %s %[^\n]",o1,o2,J);
	for(int i=0;i<strlen(o1);i++){
		o1[i]=o1[strlen(o1)-i];
	}
	for(int j=0;j<strlen(o2);j++){
		o2[j]=o2[strlen(o2)-j];
	}
	printf("%s %s %s\n",o1,o2,J);
	
	return 0;
}
