#include <stdio.h>

int main()
{
	char N[10];
	char M[100];
	char C;
	int O;
	
	scanf("%s",&N);
	scanf("%[^\n]",M);
	scanf("%c %i",&C,&O);

	
	printf("Id : %s\n",N);
	printf("Name : %s\n",M);
	printf("Class : %c\n",C);
	printf("Num : %i",O);
	return(0);
}
