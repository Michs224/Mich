#include <stdio.h>
#include <math.h>

int main()
{
	int a,b;
	float sn,n;
	a=100;
	b=50;
	
	scanf("%f",&n);
	sn=(n/2)*((2*a)+((n-1)*b));
	printf("%.f\n",sn);	
	return (0);
}
