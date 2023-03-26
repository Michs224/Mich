#include <stdio.h>
int main()
{
	int x, y, z[100000], max, min;
	scanf("%d", &x);
	for (int p=0; p<x; p++)
	{
		scanf("%d", &y);
		for(int q=0; q<y; q++)
		{
			scanf("%d", &z[q]);
		}
		
		if (z[0] >= z[1])
		{
			min = z[1];
			max = z[0];
		} else
		{
			min = z[0];
			max = z[1];
		}
		for(int r=2; r<y; r++)
		{
			if (z[r] > max)
			{
				min = max;
				max = z[r];
			} else if (z[r] < max || z[r] == max)
			{
				if (z[r] >= min)
				{
					min = z[r];
				}
			}
		}
		printf("Case #%d: %d\n", p+1, max+min);
		min = 0;
		max = 0;
		
	}
	return 0;
}
