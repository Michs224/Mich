#include <stdio.h>

int main()
{
   char ss[100];
   scanf("%[^\n]", &ss);
   printf("Congrats \"%s\" for joining the CS department at BINUS.\n", ss);
	
	return (0);
}
