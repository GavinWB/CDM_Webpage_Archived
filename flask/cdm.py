from __future__ import print_function, division, unicode_literals
import numpy as np
from psy import EmDina, MlDina
from psy.utils import r4beta

from utils import read_score, add_score, read_q_matrix

def estimate_g_s_demo():
    # Hyper param
    m = 100 # Number of students
    n = 60 # Number of questions
    # grade 4: n = 42, grade 8: n = 49
    K = 5 # Number of latent knowledges

    # Input matrices
    q_mat = np.random.binomial(1, 0.5, (K, n)) # Q-matrix: latent knowledges x questions
    # Read from file
    a_mat = np.random.binomial(1, 0.7, (m, K)) # A-matrix: student x latent knowledges

    # Guess and no slip (which is 1 - slip) probabilities for each question
    # Samples are drawn from beta distributions
    g = r4beta(1, 2, 0, 0.6, (1, n))
    no_s = r4beta(2, 1, 0.4, 1, (1, n))

    # Estimate the correct guessing and no_slipping probabilites based on each student test result
    # Using the EM algorithm (Estimation - Maximazation)
    temp = EmDina(attrs = q_mat)
    yita = temp.get_yita(a_mat)
    p_val = temp.get_p(yita, guess = g, no_slip = no_s)
    score = np.random.binomial(1, p_val)

    em_dina = EmDina(attrs = q_mat, score = score)
    est_no_s, est_g = em_dina.em()

    return est_no_s, est_g, q_mat, score

def _estimate_skills(guess, no_slip, q_mat, score):
    dina_est = MlDina(guess = guess, no_slip = no_slip, attrs = q_mat, score = score)
    est_skills = dina_est.solve()

    return est_skills

def estimate_skills(grade, student_score):
    # est_no_s, est_g, q_mat, score = estimate_g_s_demo()

    if grade == 4:
        n = 42
    elif grade == 8:
        n = 49
    else:
        grade = 4
        n = 42

    K = 15 # Number of latent knowledges

    est_no_s = 0.8 * np.ones(n, dtype = int)
    est_g = 0.2 * np.ones(n, dtype = int)
    q_mat = read_q_matrix(grade)
    add_score(grade, student_score)
    score = read_score(grade)

    est_skills = _estimate_skills(guess = est_g, no_slip = est_no_s, q_mat = q_mat, score = score)
    
    return est_skills[est_skills.shape[0] - 1] # Return the last row
