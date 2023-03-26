#!/usr/bin/env python
# coding: utf-8

# In[31]:


import numpy as np
import matplotlib.pyplot as plt

# x=np.array([0,1,2,3])
# y=np.array([0,1,4,9])

# x=np.arange(0,20)
# y=x**3

x=np.random.randn(20)
y=x**2

plt.xlabel("Babi")
plt.plot(x,y)
plt.show()


# In[32]:




x= [1,2,3,4] #list
y= (1,2,3,4) #tuple
# z=[{'Nama':'Dimas',
#     'Nilai':66,
#     'Kelas':'LC95'},
#    {'Nama':'Dimas',
#     'Nilai':66,
#     'Kelas':'LC95'},
   
#   ]

z={'Nama' : ['A','B','C','D','E'],
    'Nilai' : [60,87,72,90,55],
    'Kelas' : ['LA','LB','LA','LB','LC']
    }
   


# In[33]:


x[0]=x[0]*2
x


# In[34]:


y


# In[35]:


pip install --upgrade pandas


# In[36]:


z


# In[37]:


df=pd.DataFrame(z)
df


# In[38]:


np.cumsum(df['Nilai'])


# In[39]:


df['Nilai']


# In[40]:


np.mean(df['Nilai'])


# In[41]:


df[df['Nilai']> np.mean(df['Nilai'])]


# In[42]:


df[(df['Nilai'] < np.mean(df['Nilai'])) & (df['Kelas'] == 'LA')]


# NUMPY, SKLEARN, SCIKIT #MACHINE LEARNING
# TENSORFLOW, PYTORCH #DEEP LEARNING

# In[ ]:




