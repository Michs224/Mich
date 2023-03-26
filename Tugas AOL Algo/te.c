#include <stdio.h>

int main()
{
    int num1, num2 = 4, num3;
    
    one:
        for (num1 = 0; num1 < num2; num1++)
        {
            num3 += num1;
            printf("label one | num1 %i | num3 %i\n", num1, num3);
        }
        goto two;
        
    two: 
        if (num3 > 3) {
            printf("label two | num1 %i | num3 %i\n", num1, num3);
            goto three;
        }
        goto one;
        
    three:
        printf("label three | end");
        
    return 0;

}

