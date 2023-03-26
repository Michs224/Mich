#include <stdio.h>

int main()
{
	char N[10];
	char M[100];
	char C;
	int O;
	
	scanf("%s\n",&N);
	scanf("%[^\n]\n",M);
	scanf("%c %i",&C,&O);
	
	printf("Id\t: %s\n",N);
	printf("Name\t: %s\n",M);
	printf("Class\t: %c\n",C);
	printf("Num\t: %i\n",O);
	
	return(0);
}
