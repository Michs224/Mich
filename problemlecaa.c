#include <stdio.h>

int main()
{
	char N[10];
	char M[100];
	char CC;
	int O;
	
	scanf("%s\n",&N);
	scanf("%[^\n]\n",M);
	scanf("%c %i",&CC,&O);
	
	printf("Id    : %s\n",N);
	printf("Name  : %s\n",M);
	printf("Class : %c\n",CC);
	printf("Num   : %i\n",O);
	
	return(0);
}
