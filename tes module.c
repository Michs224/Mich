#include <stdio.h>
#include <math.h>

int main (){
	int n;
    printf("Input the numbers: ");
    scanf("%d",&n);
	export module [oddEven];

	oddEven (int u){

        int result;
        result = u%2;
        if (result == 0)
        printf("Result : Even number");
        else
        printf("Result : Odd number");
    }

	return (0);

	}
